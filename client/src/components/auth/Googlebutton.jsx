// src/components/auth/GoogleButton.jsx
import React from 'react';
import { FaGoogle } from 'react-icons/fa6';

const GoogleButton = ({ onClick }) => {
  const handleClick = () => {
    if (onClick) return onClick();
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`;
  };

  return (
    <button
      onClick={() => {
        console.log('clicked');
        window.location.href = `http://localhost:5000/api/auth/google`;
      }}
      className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-sm py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
    >
      <FaGoogle className="w-4 h-4 text-[#DB4437]" />
      Continue with Google
    </button>
  );
};

export default GoogleButton;