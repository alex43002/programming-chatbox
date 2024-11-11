import React, { useState } from 'react';

const Input = ({ onSend }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="flex mt-4">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-grow p-2 border rounded-l-md focus:outline-none"
      />
      <button onClick={handleSend} className="bg-blue-500 text-white px-4 rounded-r-md">
        Send
      </button>
    </div>
  );
};

export default Input;
