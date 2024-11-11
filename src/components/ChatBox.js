import React, { useState } from 'react';
import Message from './Message';
import Input from './Input';
import Header from './Header';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);

  const addMessage = (text, isUser) => {
    const newMessage = { id: messages.length + 1, text, isUser };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const resetChat = () => setMessages([]); // Temporary reset, will add JSON management later

  return (
    <div className="w-full h-full p-4 bg-gray-100 rounded-lg shadow-md">
      <Header onReset={resetChat} />
      <div className="flex flex-col gap-2 overflow-y-auto">
        {messages.map((msg) => (
          <Message key={msg.id} text={msg.text} isUser={msg.isUser} />
        ))}
      </div>
      <Input onSend={(text) => addMessage(text, true)} />
    </div>
  );
};

export default ChatBox;
