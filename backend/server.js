const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

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

// Start the server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
