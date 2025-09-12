
import React from 'react';
import { STYLE_KEYWORDS, QUALITY_MODIFIERS } from '../constants';

interface PromptInputProps {
  prompt: string;
  // FIX: The type of `setPrompt` has been updated to allow functional updates (e.g., `setPrompt(prev => ...)`).
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  onRefine: () => void;
  isLoading: boolean;
  isEditing: boolean;
}

const StyleButton: React.FC<{ onClick: () => void, children: React.ReactNode }> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-full text-sm transition-colors"
  >
    {children}
  </button>
);

export const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, onRefine, isLoading, isEditing }) => {
  const addKeyword = (keyword: string) => {
    setPrompt(prev => prev ? `${prev}, ${keyword}` : keyword);
  };

  return (
    <div className="space-y-4">
      <label htmlFor="prompt" className="block text-xl font-semibold text-slate-300">
        {isEditing ? 'Describe Your Edit' : 'Describe Your Image'}
      </label>
      <div className="relative">
        <textarea
          id="prompt"
          rows={4}
          className="w-full p-4 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-lg"
          placeholder={isEditing ? 'e.g., "Change the background to a futuristic city at night"' : 'e.g., "A majestic lion wearing a crown, studio lighting, photorealistic"'}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={onRefine}
          disabled={isLoading}
          className="absolute bottom-3 right-3 bg-fuchsia-600 hover:bg-fuchsia-700 disabled:bg-fuchsia-900 text-white font-semibold py-1 px-3 rounded-md text-sm transition-colors"
        >
          {isLoading ? '...' : '✨ Refine Prompt'}
        </button>
      </div>

      <div>
        <h3 className="text-md font-medium text-slate-400 mb-2">Add Styles</h3>
        <div className="flex flex-wrap gap-2">
          {STYLE_KEYWORDS.map(keyword => (
            <StyleButton key={keyword} onClick={() => addKeyword(keyword)}>
              {keyword}
            </StyleButton>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-md font-medium text-slate-400 mb-2">Add Quality Modifiers</h3>
        <div className="flex flex-wrap gap-2">
          {QUALITY_MODIFIERS.map(keyword => (
            <StyleButton key={keyword} onClick={() => addKeyword(keyword)}>
              {keyword}
            </StyleButton>
          ))}
        </div>
      </div>
    </div>
  );
};