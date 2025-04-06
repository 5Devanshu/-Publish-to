# SupportAi

SupportAI is a sophisticated customer support tool that leverages AI to analyze customer conversations and provide actionable insights. The application improves support efficiency and customer satisfaction by analyzing chat data, categorizing issues, detecting sentiment, and automating follow-up actions.

## Features

- **AI-Powered Chat Analysis**: Automatically analyzes conversations for sentiment, ticket type, and required actions
- **Interactive Chatbot**: User-friendly interface for customer interactions powered by Gemini 1.5 Flash
- **PDF Upload**: Upload requirements documents for reference during conversations
- **Email Automation**: Automatically generates and sends follow-up emails based on analysis results
- **Insightful Analytics**: Gain valuable insights into customer needs and support performance

## Technology Stack

### Frontend
- React
- JavaScript
- Vite
- Lucide React
- Shadcn UI

### Backend
- Node.js
- Express
- Python
- SQLite

### AI & Services
- Google Gemini 1.5 Flash
- Resend (for email delivery)

## Project Structure

```
project-root/
│
├── backend/
│   ├── database/
│   │   ├── users.db
│   │   └── db_init.js
│   │
│   ├── agents/
│   │   ├── email/
│   │   │   └── send_email.py
│   │   │
│   │   ├── analytics/
│   │   │   ├── analyze_chat.py
│   │   │   └── parseToJson.js
│   │   │
│   │   ├── routing/
│   │   │   └── (task routing and assignment files)
│   │   │
│   │   └── chatbot/
│   │       └── (chatbot implementation files)
│   │
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chatbot.jsx
│   │   │   ├── UploadPDF.jsx
│   │   │   └── ui/
│   │   │       └── (Shadcn UI components)
│   │   │
│   │   └── App.jsx
│   │
│   └── (other frontend files)
│
├── package.json
└── package-lock.json
```

## Agent Architecture

ChatAnalysis uses a multi-agent system to handle different aspects of the customer support workflow:

1. **Customer Interface**: The frontend where users interact with the chatbot
2. **Chatbot Agent**: Responds to customer messages using the Gemini 1.5 Flash AI model
3. **Analysis Agent**: Extracts key information such as sentiment, ticket type, and required actions
4. **Email Agent**: Manages email notifications and follow-ups based on analysis results

## Getting Started

### Prerequisites

- Node.js (v14+)
- Python (v3.7+)
- SQLite

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/chatanalysis.git
   cd chatanalysis
   ```

2. Install backend dependencies:
   ```bash
   npm install
   pip install -r requirements.txt  # If you have a requirements.txt file
   ```

3. Initialize the database:
   ```bash
   node backend/database/db_init.js
   ```

4. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

### Configuration

1. Create a `.env` file in the project root with the following variables:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   RESEND_API_KEY=your_resend_api_key
   PORT=3000
   ```

### Running the Application

1. Start the backend server:
   ```bash
   node backend/server.js
   ```

2. In a separate terminal, start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
