// src/components/chatbot/ChatMessage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
        isUser ? 'bg-[#832729] text-white' : 'bg-[#2a1314] text-white'
      }`}>
        {isUser ? 'You' : 'VJ'}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] flex flex-col gap-2`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-[#832729] text-white rounded-tr-none'
            : 'bg-gray-100 text-gray-800 rounded-tl-none'
        }`}>
          {message.content}
        </div>

        {/* Product Cards */}
        {message.products?.length > 0 && (
          <div className="flex flex-col gap-2">
            {message.products.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                className="flex items-center gap-3 bg-white border border-gray-100 rounded-lg p-2.5 hover:border-[#832729]/30 transition-colors shadow-sm"
              >
                <div className="w-14 h-14 flex-shrink-0 rounded-md overflow-hidden bg-gray-50">
                  <img
                      src={product.image || 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=100'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{product.name}</p>
                  <p className="text-xs text-[#832729] font-semibold">
                    ₹ {product.price.toLocaleString('en-IN')}
                  </p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">View →</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;