const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const fetch = require('node-fetch'); // You might need to install this package
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;
const OLLAMA_API_URL = 'http://localhost:11434/api/generate'; // Default Ollama API endpoint

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(session({
  secret: 'chat-analysis-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Database setup
const db = new sqlite3.Database('users.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the users database.');
  
  // Create conversations table if it doesn't exist
  db.run(`CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    conversation_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
});

// Initialize or retrieve conversation history for a session
app.use((req, res, next) => {
  if (!req.session.conversationId && req.path !== '/login' && req.path !== '/signup') {
    // Create a new conversation entry for the session if authenticated
    if (req.session.userId) {
      db.run(
        `INSERT INTO conversations (user_id, conversation_data) VALUES (?, ?)`,
        [req.session.userId, ''],
        function(err) {
          if (!err) {
            req.session.conversationId = this.lastID;
          }
          next();
        }
      );
    } else {
      // For non-authenticated users, just use session storage
      req.session.conversation = '';
      next();
    }
  } else {
    next();
  }
});

// Function to call Ollama API with Llama3 model
async function callOllama(prompt, systemPrompt = '') {
  try {
    // Format the conversation for Ollama
    const requestBody = {
      model: 'llama3', // Use the Llama3 model you have downloaded
      prompt: prompt,
      stream: false
    };
    
    // Add system prompt if provided
    if (systemPrompt) {
      requestBody.system = systemPrompt;
    }
    
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error(`Ollama API returned status ${response.status}`);
    }
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error calling Ollama:', error);
    throw error;
  }
}

// Chat Route
app.post('/api/chat', async (req, res) => {
  const { prompt, systemPrompt } = req.body;
  
  // Get the current conversation
  let currentConversation = '';
  
  if (req.session.userId && req.session.conversationId) {
    // Get from database for authenticated users
    db.get(
      `SELECT conversation_data FROM conversations WHERE id = ?`,
      [req.session.conversationId],
      async (err, row) => {
        if (err || !row) {
          return res.status(500).json({ error: 'Failed to retrieve conversation' });
        }
        
        currentConversation = row.conversation_data;
        await processChat(currentConversation);
      }
    );
  } else {
    // Use session storage for non-authenticated users
    currentConversation = req.session.conversation || '';
    processChat(currentConversation);
  }
  
  async function processChat(conversation) {
    // Append user's message
    const updatedConversation = conversation + `Customer: ${prompt}\n`;
    
    try {
      // Call Ollama with Llama3 model
      const reply = await callOllama(prompt, systemPrompt);
      
      // Append bot's reply
      const finalConversation = updatedConversation + `Chatbot: ${reply}\n`;
      
      // Save the updated conversation
      if (req.session.userId && req.session.conversationId) {
        db.run(
          `UPDATE conversations SET conversation_data = ? WHERE id = ?`,
          [finalConversation, req.session.conversationId]
        );
      } else {
        req.session.conversation = finalConversation;
      }
      
      res.json({ 
        reply, 
        conversation: finalConversation 
      });
    } catch (err) {
      console.error('Ollama Error:', err);
      res.status(500).json({ error: 'Ollama error', message: err.message });
    }
  }
});

// Maintaining the old endpoint for backward compatibility
app.post('/api/gemini-chat', async (req, res) => {
  // Redirect to the new endpoint
  req.url = '/api/chat';
  app.handle(req, res);
});

// Chat analysis endpoint
app.post('/api/analyze-chat', (req, res) => {
  let conversation;
  
  if (req.body.conversation) {
    // Use provided conversation if available
    conversation = req.body.conversation;
    analyzeConversation();
  } else if (req.session.userId && req.session.conversationId) {
    // Get from database for authenticated users
    db.get(
      `SELECT conversation_data FROM conversations WHERE id = ?`,
      [req.session.conversationId],
      (err, row) => {
        if (err || !row) {
          return res.status(500).json({ error: 'Failed to retrieve conversation' });
        }
        
        conversation = row.conversation_data;
        analyzeConversation();
      }
    );
  } else {
    // Use session storage for non-authenticated users
    conversation = req.session.conversation || '';
    analyzeConversation();
  }
  
  function analyzeConversation() {
    if (!conversation) {
      return res.status(400).json({ error: 'No conversation to analyze' });
    }
    
    // Execute Python script with conversation as argument
    exec(`python analyze_chat.py "${conversation.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Python script execution error: ${error}`);
        return res.status(500).json({ error: 'Failed to analyze conversation' });
      }
      
      if (stderr) {
        console.error(`Python stderr: ${stderr}`);
      }
      
      try {
        // Parse the JSON output from the Python script
        const analysis = JSON.parse(stdout);
        res.json(analysis);
      } catch (parseError) {
        console.error(`JSON parse error: ${parseError}`);
        res.status(500).json({ error: 'Failed to parse analysis result', raw: stdout });
      }
    });
  }
});

// Add a health check endpoint to verify Ollama is running
app.get('/api/ollama-status', async (req, res) => {
  try {
    // List models to check if Ollama is running
    const response = await fetch('http://localhost:11434/api/tags');
    
    if (!response.ok) {
      throw new Error(`Ollama API returned status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if Llama3 model is available
    const hasLlama3 = data.models && data.models.some(model => 
      model.name === 'llama3' || model.name.startsWith('llama3:')
    );
    
    res.json({ 
      status: 'ok', 
      ollama_running: true,
      llama3_available: hasLlama3,
      available_models: data.models ? data.models.map(m => m.name) : []
    });
  } catch (error) {
    res.json({ 
      status: 'error', 
      ollama_running: false,
      message: error.message
    });
  }
});

// Auth routes
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send('Missing required fields.');
  }

  // Insert user into the database
  db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [name, email, password], function(err) {
    if (err) {
      return res.status(500).send(`Signup failed: ${err.message}`);
    }
    
    // Set user as logged in
    req.session.userId = this.lastID;
    
    res.status(201).send({ 
      message: 'User created successfully', 
      userId: this.lastID 
    });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Missing required fields.');
  }

  // Retrieve user from the database
  db.get(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password], (err, row) => {
    if (err) {
      return res.status(500).send(`Login failed: ${err.message}`);
    }

    if (!row) {
      return res.status(401).send('Invalid credentials.');
    }
    
    // Set user as logged in
    req.session.userId = row.id;
    
    res.send({ 
      message: 'Login successful', 
      userId: row.id 
    });
  });
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Logout failed');
    }
    res.send({ message: 'Logged out successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Ollama integration enabled with Llama3 model`);
  console.log(`Check Ollama status at http://localhost:${PORT}/api/ollama-status`);
});