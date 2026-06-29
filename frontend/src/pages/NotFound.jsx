import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md w-full p-8 rounded-2xl glass glow-primary border border-dark-border">
        {/* Visual 404 badge */}
        <span className="text-6xl font-black text-primary-500 tracking-wider animate-pulse block mb-4">
          404
        </span>
        
        <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          Oops! The page you are looking for does not exist, or you might not have authorization to view it.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:scale-[1.02] cursor-pointer text-sm w-full"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
