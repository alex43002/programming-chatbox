import React from 'react';

const Message = ({ text, isUser }) => {
  return (
    <div className={`p-2 rounded-md ${isUser ? 'bg-blue-200 self-end' : 'bg-gray-200 self-start'}`}>
      {text}
    </div>
  );
};

export default Message;
