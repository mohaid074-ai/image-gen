
import React from 'react';

interface HistoryProps {
  images: string[];
  onSelectImage: (imageDataUrl: string) => void;
}

export const History: React.FC<HistoryProps> = ({ images, onSelectImage }) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-slate-300">Generation History</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((imgSrc, index) => (
          <div 
            key={index} 
            className="group relative rounded-lg overflow-hidden cursor-pointer shadow-lg transform hover:scale-105 transition-transform duration-300"
            onClick={() => onSelectImage(imgSrc)}
          >
            <img src={imgSrc} alt={`History item ${index + 1}`} className="w-full h-full object-cover aspect-square" />
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center text-center p-2">
              <p className="text-white font-semibold text-sm">Use as base for editing</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};