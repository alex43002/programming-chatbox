require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = process.env.GEMINI_API_URL;


// Middleware
app.use(cors());
app.use(express.json());

// Path to the chat history JSON file
const chatHistoryPath = path.join(__dirname, 'chatHistory.json');

// Ensure chatHistory.json exists with an empty array if it doesn't already
if (!fs.existsSync(chatHistoryPath)) {
  fs.writeFileSync(chatHistoryPath, JSON.stringify([]), 'utf8');
}

// Endpoint to retrieve chat history
app.get('/api/chat-history', (req, res) => {
  fs.readFile(chatHistoryPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read chat history' });
    res.json(JSON.parse(data));
  });
});

// Endpoint to save a new message to the chat history
app.post('/api/chat-history', (req, res) => {
  const newMessage = req.body;

  fs.readFile(chatHistoryPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read chat history' });

    const chatHistory = JSON.parse(data);
    chatHistory.push(newMessage);

    fs.writeFile(chatHistoryPath, JSON.stringify(chatHistory, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Failed to save message' });
      res.json({ message: 'Message saved' });
    });
  });
});

// Endpoint to reset chat history
app.delete('/api/chat-history', (req, res) => {
  fs.writeFile(chatHistoryPath, JSON.stringify([], null, 2), (err) => {
    if (err) return res.status(500).json({ error: 'Failed to reset chat history' });
    res.json({ message: 'Chat history reset' });
  });
});

app.post('/api/gemini-chat', async (req, res) => {
  const userMessage = req.body.text;

  // Load chat history
  const chatHistory = JSON.parse(fs.readFileSync(chatHistoryPath, 'utf8'));

  // Collect recent history up to the last 500 characters
  const recentHistory = [];
  let characterCount = 0;

  for (let i = chatHistory.length - 1; i >= 0; i--) {
    const message = chatHistory[i];
    const text = message.isUser ? `Previous User Message: ${message.text}` : `Previous Bot Response: ${message.text}`;
    characterCount += text.length;

    if (characterCount > 500) break;
    recentHistory.unshift(text); // Add each message to the beginning to keep order
  }

  // Construct the `parts` array with labeled history and current message
  const parts = recentHistory.map(text => ({ text: `Context from previous conversation:\n${text}` }));
  parts.push({ text: `User's current question:\n${userMessage}` });

  // Prepare payload with constructed parts array
  const payload = {
    contents: [{ parts }]
  };

  try {
    const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error.message || 'Error communicating with Gemini API');
    }

    // Ensure structure matches expected response
    if (!data.candidates || !data.candidates[0].content || !data.candidates[0].content.parts) {
      throw new Error('Unexpected response structure from Gemini API');
    }

    // Collect text from each part in the API's response
    const botMessage = data.candidates[0].content.parts
      .map(part => part.text)
      .join('\n');
    
    // Append user and bot messages to chat history
    chatHistory.push({ id: chatHistory.length + 1, text: userMessage, isUser: true });
    chatHistory.push({ id: chatHistory.length + 1, text: botMessage, isUser: false });

    fs.writeFileSync(chatHistoryPath, JSON.stringify(chatHistory, null, 2));

    // Send the bot message back to the frontend
    res.json({ botMessage });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to communicate with Gemini API' });
  }
});

  

// Start the server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
