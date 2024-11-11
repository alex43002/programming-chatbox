import React from 'react';

const Header = ({ onReset }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold">Programming Chatbox</h2>
      <button onClick={onReset} className="bg-red-500 text-white px-4 py-2 rounded-md">
        Reset Chat
      </button>
    </div>
  );
};

export default Header;
