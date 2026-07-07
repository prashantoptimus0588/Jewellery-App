// src/components/chatbot/ChatInput.jsx
import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa6';

const ChatInput = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <div className="flex items-center gap-2 p-3 border-t border-gray-100 bg-white">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Ask about jewellery..."
        disabled={disabled}
        className="flex-grow text-sm px-4 py-2.5 rounded-full border border-gray-200 outline-none focus:border-[#832729] transition-colors disabled:opacity-50"
      />
      <button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        className="w-9 h-9 bg-[#832729] text-white rounded-full flex items-center justify-center hover:bg-[#6a1f21] transition-colors disabled:opacity-50 flex-shrink-0"
      >
        <FaPaperPlane className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default ChatInput;