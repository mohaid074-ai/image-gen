
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplay } from './components/ImageDisplay';
import { History } from './components/History';
import { refinePrompt, generateImages, editImage } from './services/geminiService';
import type { UploadedImage } from './types';
import { Tab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.GENERATE);
  const [prompt, setPrompt] = useState<string>('');
  const [numVariations, setNumVariations] = useState<number>(1);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleRefinePrompt = useCallback(async () => {
    if (!prompt) {
      setError('Please enter a prompt to refine.');
      return;
    }
    setIsLoading(true);
    setLoadingMessage('Refining prompt...');
    setError(null);
    try {
      const refined = await refinePrompt(prompt);
      setPrompt(refined);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred during prompt refinement.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  const handleGenerate = useCallback(async () => {
    if (!prompt) {
      setError('Please enter a prompt to generate an image.');
      return;
    }
    setIsLoading(true);
    setLoadingMessage('Generating images... this may take a moment.');
    setError(null);
    setGeneratedImages([]);
    try {
      const images = await generateImages(prompt, numVariations);
      setGeneratedImages(images);
      setHistory(prev => [...images, ...prev]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred during image generation.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, numVariations]);
  
  const handleEdit = useCallback(async () => {
    if (!prompt) {
        setError('Please enter a prompt to describe the edit.');
        return;
    }
    if (!uploadedImage) {
        setError('Please upload an image to edit.');
        return;
    }
    setIsLoading(true);
    setLoadingMessage('Editing image... this may take a moment.');
    setError(null);
    setGeneratedImages([]);

    try {
      const editedImages = await editImage(prompt, uploadedImage);
      setGeneratedImages(editedImages);
      setHistory(prev => [...editedImages, ...prev]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred during image editing.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, uploadedImage]);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage({ file, dataUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
    setGeneratedImages([]);
  };
  
  const handleSelectFromHistory = (imgDataUrl: string) => {
    setUploadedImage({ file: null, dataUrl: imgDataUrl });
    setActiveTab(Tab.EDIT);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex border-b border-slate-700 mb-6">
              <button
                onClick={() => setActiveTab(Tab.GENERATE)}
                className={`px-4 py-3 text-lg font-medium transition-colors duration-200 ease-in-out focus:outline-none ${
                  activeTab === Tab.GENERATE ? 'text-teal-400 border-b-2 border-teal-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                Generate Image
              </button>
              <button
                onClick={() => setActiveTab(Tab.EDIT)}
                className={`px-4 py-3 text-lg font-medium transition-colors duration-200 ease-in-out focus:outline-none ${
                  activeTab === Tab.EDIT ? 'text-teal-400 border-b-2 border-teal-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                Edit Image
              </button>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6" role="alert">
                <p>{error}</p>
              </div>
            )}
            
            <div className={activeTab === Tab.EDIT ? '' : 'hidden'}>
              <ImageUploader onImageUpload={handleImageUpload} uploadedImage={uploadedImage} />
            </div>
            
            <PromptInput 
              prompt={prompt} 
              setPrompt={setPrompt} 
              onRefine={handleRefinePrompt} 
              isLoading={isLoading}
              isEditing={activeTab === Tab.EDIT}
            />

            {activeTab === Tab.GENERATE && (
              <div className="mt-4">
                <label htmlFor="numVariations" className="block text-sm font-medium text-slate-400 mb-2">Number of Variations</label>
                <select
                  id="numVariations"
                  value={numVariations}
                  onChange={(e) => setNumVariations(Number(e.target.value))}
                  className="bg-slate-700 border border-slate-600 rounded-md w-full p-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
            )}

            <div className="mt-8">
              <button
                onClick={activeTab === Tab.GENERATE ? handleGenerate : handleEdit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-teal-500 to-fuchsia-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
              >
                {isLoading ? 'Processing...' : (activeTab === Tab.GENERATE ? `Generate ${numVariations > 1 ? numVariations + ' Images' : 'Image'}` : 'Apply Edit')}
              </button>
            </div>
          </div>

          <ImageDisplay 
            generatedImages={generatedImages} 
            isLoading={isLoading} 
            loadingMessage={loadingMessage} 
          />
        </div>

        <History 
          images={history} 
          onSelectImage={handleSelectFromHistory} 
        />
      </main>
    </div>
  );
};

export default App;