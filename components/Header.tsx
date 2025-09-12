
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-fuchsia-500">
          AI Image Studio
        </h1>
        <p className="text-center text-slate-400 mt-1">
          Generate & Edit Images with the Power of Gemini
        </p>
      </div>
    </header>
  );
};