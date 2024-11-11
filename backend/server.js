require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = process.env.GEMINI_API_URL;
const CACHE_DURATION = parseInt(process.env.CACHE_DURATION, 10);

let lastContextId = null;
let lastContextTimestamp = null;


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
  
    // Load chat history for context
    const chatHistory = JSON.parse(fs.readFileSync(chatHistoryPath, 'utf8'));
  
    // Check if the cached context is still valid
    const currentTime = Date.now();
    const isContextValid = lastContextId && lastContextTimestamp &&
                           (currentTime - lastContextTimestamp < CACHE_DURATION * 1000);
  
    // Prepare the API payload
    const payload = {
      contents: [
        {
          parts: [
            { text: userMessage }
          ]
        }
      ]
    };
  
    // Add context caching if available and valid
    if (isContextValid) {
      payload.context = lastContextId;
    }
  
    try {
      // Send the request to the Gemini API
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GEMINI_API_KEY}`
        },
        body: JSON.stringify(payload)
      });      
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error.message || 'Error communicating with Gemini API');
      }
  
      // Capture and save the API's response
      const botMessage = data.contents[0].parts[0].text;
  
      // Update context cache
      lastContextId = data.context || lastContextId; // Update with new context if provided
      lastContextTimestamp = currentTime;
  
      // Add both user message and bot response to chat history
      chatHistory.push({ id: chatHistory.length + 1, text: userMessage, isUser: true });
      chatHistory.push({ id: chatHistory.length + 1, text: botMessage, isUser: false });
  
      fs.writeFileSync(chatHistoryPath, JSON.stringify(chatHistory, null, 2));
  
      // Send response back to frontend
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
