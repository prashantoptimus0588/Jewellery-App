// src/components/layout/UserLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import ChatWindow from '../chatBot/ChatWindow';

const UserLayout = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div>
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />

      {/* LiveChat Button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-[#832729] text-white px-2 py-6 rounded-l-md shadow-lg hover:bg-[#6a1f21] transition-colors z-40"
      >
        <span className="writing-vertical-rl transform rotate-180 text-sm font-semibold tracking-wider"
          style={{ writingMode: 'vertical-rl' }}>
          {chatOpen ? 'Close' : 'LiveChat'}
        </span>
      </button>

      <ChatWindow isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default UserLayout;