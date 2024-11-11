import React, { useEffect, useState } from 'react';
import Message from './Message';
import Input from './Input';
import Header from './Header';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);

  // Load chat history from the backend on component mount
  useEffect(() => {
    fetch('http://localhost:5000/api/chat-history') // Use the full backend URL
      .then(response => response.json())
      .then(data => setMessages(data))
      .catch(error => console.error('Error loading chat history:', error));
  }, []);

  const addMessage = (text, isUser) => {
    const newMessage = { id: messages.length + 1, text, isUser };
  
    // Update state locally
    setMessages(prevMessages => [...prevMessages, newMessage]);
  
    // Only call the Gemini API for user messages
    if (isUser) {
      fetch('http://localhost:5000/api/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
        .then(response => response.json())
        .then(data => {
          const botMessage = data.botMessage;
          // Add the bot's response to the chat
          setMessages(prevMessages => [...prevMessages, { id: prevMessages.length + 1, text: botMessage, isUser: false }]);
        })
        .catch(error => console.error('Error sending message to Gemini API:', error));
    }
  };
  

  const resetChat = () => {
    fetch('http://localhost:5000/api/chat-history', { // Use the full backend URL
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(() => setMessages([])) // Clear the messages in state after a successful reset
      .catch(error => console.error('Error resetting chat history:', error));
  };

  return (
    <div className="w-full h-full p-4 bg-gray-100 rounded-lg shadow-md">
      <Header onReset={resetChat} />
      <div className="flex flex-col gap-2 overflow-y-auto">
        {messages.map(msg => (
          <Message key={msg.id} text={msg.text} isUser={msg.isUser} />
        ))}
      </div>
      <Input onSend={text => addMessage(text, true)} />
    </div>
  );
};

export default ChatBox;
