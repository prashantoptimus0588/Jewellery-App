import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <p className="text-8xl font-serif text-[#832729] mb-4">404</p>
      <h1 className="text-2xl font-serif text-gray-800 mb-2">Page Not Found</h1>
      <p className="text-gray-500 text-sm mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-[#832729] text-white px-8 py-3 rounded-sm text-sm font-medium hover:bg-[#6a1f21] transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;