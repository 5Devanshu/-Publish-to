import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { exec } from 'child_process';
import fetch from 'node-fetch';
import session from 'express-session';
import sqlite3Pkg from 'sqlite3';
import axios from 'axios';
import {spawn} from'child_process';
import kardoJson from'./parseToJson.js';
const sqlite3 = sqlite3Pkg.verbose();

const app = express();
const PORT = 3000;
const GEMINI_API_KEY = 'AIzaSyD-LzirwWMvUYapypfIzwvKr13mYRNfYIY'; // User provided Gemini API key
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

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

async function callGemini(prompt, systemPrompt = '') {
  try {
    const requestBody = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini:', error);
    throw error;
  }
}
let fullConversation = '';
// Chat Route
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;
  fullConversation += `Customer: ${prompt}\n`;

  try {
    const response = await axios.post(GEMINI_API_URL, {
      contents: [
        {
          parts: [{ text: fullConversation }],
          role: 'user'
        }
      ]
    });

    const reply = response.data.candidates[0].content.parts[0].text.trim();
    fullConversation += `Chatbot: ${reply}\n`;

    res.json({ reply, conversation: fullConversation });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Gemini API error' });
  }
});

// Chat analysis endpoint
app.post('/api/analyze-chat', (req, res) => {
  const conversation = req.body.conversation;

  if (!conversation) {
    return res.status(400).send('Conversation is required in req.body.conversation');
  }

  const pyProcess = spawn('python', ['analyze_chat.py', conversation]);

  let output = '';
  let errorOutput = '';

  pyProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  pyProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  pyProcess.on('close', (code) => {
    if (code === 0) {
      const parsed = kardoJson(output);
      
      if (parsed?.requires_email) {
        const subject = "Regarding your request";
        const htmlBody = `
          <div style="font-family:Arial, sans-serif; padding:20px;">
            <h2 style="color:#0066cc;">Hi Jash,</h2>
            <p>${parsed.email_context}</p>
            <p style="margin-top:20px;">Best regards,<br><b>Team Tarang</b></p>
          </div>
        `;

        const emailProcess = spawn('python', ['send_email.py', subject, htmlBody]);

        emailProcess.stdout.on('data', (data) => {
          console.log(`✅ Email Sent: ${data.toString()}`);
        });

        emailProcess.stderr.on('data', (data) => {
          console.error(`❌ Email Send Error: ${data.toString()}`);
        });

        emailProcess.on('close', (emailCode) => {
          console.log(`📨 Email script exited with code ${emailCode}`);
        });
      }

      res.send(parsed);
    } else {
      res.status(500).send(`Python error:\n${errorOutput}`);
    }
  });
});

// Auth routes
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send('Missing required fields.');
  }

  // Insert user into the database
  db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password], function(err) {
    if (err) {
      return res.status(500).send("Signup failed: " + err.message);
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
  db.get("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, row) => {
    if (err) {
      return res.status(500).send("Login failed: " + err.message);
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
  console.log(`'Server running at http://localhost:\${PORT}'`);
  console.log(`Gemini integration enabled`);
});
