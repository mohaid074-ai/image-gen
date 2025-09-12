
import React from 'react';

interface ImageDisplayProps {
  generatedImages: string[];
  isLoading: boolean;
  loadingMessage: string;
}

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ generatedImages, isLoading, loadingMessage }) => {
  if (isLoading) {
    return (
      <div className="bg-gray-800/50 p-8 min-h-[300px] flex flex-col justify-center items-center text-center">
        <LoadingSpinner />
        <p className="text-lg font-medium text-gray-300 mt-4">{loadingMessage}</p>
        <p className="text-gray-400">AI is thinking...</p>
      </div>
    );
  }

  if (generatedImages.length === 0) {
    return (
        <div className="bg-gray-800/50 p-8 min-h-[300px] flex justify-center items-center text-center">
            <p className="text-xl text-gray-500">Your generated images will appear here</p>
        </div>
    );
  }

  const downloadImage = (dataUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `ai-image-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-900/50 p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Generated Images</h2>
      <div className={`grid gap-6 ${generatedImages.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
        {generatedImages.map((imgSrc, index) => (
          <div key={index} className="group relative rounded-lg overflow-hidden shadow-xl">
            <img src={imgSrc} alt={`Generated art ${index + 1}`} className="w-full h-auto object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center">
              <button 
                onClick={() => downloadImage(imgSrc, index)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform group-hover:scale-100 scale-90"
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
