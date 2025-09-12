
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          AI Image Studio
        </h1>
        <p className="text-center text-gray-400 mt-1">
          Generate & Edit Images with the Power of Gemini
        </p>
      </div>
    </header>
  );
};
