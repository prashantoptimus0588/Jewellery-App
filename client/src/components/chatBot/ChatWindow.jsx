// src/components/chatbot/ChatWindow.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaXmark, FaTrash, FaWandMagicSparkles } from 'react-icons/fa6';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { sendMessage, clearSession } from '../../services/chatService';

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: 'Namaste! 🙏 I\'m your Vikas Jewellers assistant. I can help you find the perfect jewellery for any occasion, budget, or loved one. What are you looking for today?',
  products: [],
};

const ChatWindow = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text) => {
    // Add user message immediately
    setMessages((prev) => [...prev, { role: 'user', content: text, products: [] }]);
    setLoading(true);

    try {
      const data = await sendMessage(text, sessionId);
      setSessionId(data.sessionId);

      // Add assistant response with products
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: data.response,
        products: data.products || [],
      }]);
    } catch (err) {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: 'Sorry, I ran into an issue. Please try again!',
        products: [],
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (sessionId) await clearSession(sessionId);
    setSessionId(null);
    setMessages([WELCOME_MESSAGE]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-4 w-full max-w-sm bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-100"
      style={{ height: '520px' }}>

      {/* Header */}
      <div className="bg-[#2a1314] px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          {/* <div className="w-8 h-8 bg-[#832729] rounded-full flex items-center justify-center">
            <FaWandMagicSparkles className="w-4 h-4 text-white" />
          </div> */}
          <div>
            <p className="text-sm font-semibold text-white">AI Assistant</p>
            <p className="text-xs text-gray-400">Powered by Gemini</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-white transition-colors p-1"
            title="Clear chat"
          >
            <FaTrash className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <FaXmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto px-4 py-4 flex flex-col gap-4 bg-gray-50/50">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#2a1314] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              VJ
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  );
};

export default ChatWindow;