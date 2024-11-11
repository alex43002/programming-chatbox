import React from 'react';
import ReactMarkdown from 'react-markdown';

const Message = ({ text, isUser }) => {
  return (
    <div className={`p-2 rounded-md ${isUser ? 'bg-blue-200 self-end' : 'bg-gray-200 self-start'}`}>
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
};

export default Message;
