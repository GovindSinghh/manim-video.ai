import React, { useState } from 'react';
import { Send, Sparkles, X } from 'lucide-react';
import { useGeneration, useGenerateScript } from '../contexts/GenerationContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface SuggestionProps {
  text: string;
  onClick: (text: string) => void;
}

const Suggestion: React.FC<SuggestionProps> = ({ text, onClick }) => (
  <button
    onClick={() => onClick(text)}
    className="inline-flex items-center px-3 py-1 m-1 text-sm bg-purple-100 text-purple-800 rounded-full 
               hover:bg-purple-200 transition-colors duration-200 cursor-pointer"
  >
    <Sparkles className="w-3 h-3 mr-1" />
    {text}
  </button>
);

const PromptInput: React.FC = () => {
  const navigate=useNavigate();
  const { state, dispatch } = useGeneration();
  const { generate, isGenerating } = useGenerateScript();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'SET_PROMPT', payload: e.target.value });

  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.prompt) return;
    let userPrompt=state.prompt;

    try {
      const token=localStorage.getItem('token');
      const res=await axios.post("http://localhost:3000/api/userPrompt", {
        userPrompt
      },{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      state.scriptId=res.data.scriptId;
      if(res.status===200){
        generate();
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        console.error('Error in sending user prompt:', error);
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    dispatch({ type: 'SET_PROMPT', payload: suggestion });
    setIsExpanded(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      generate();
    }
  };

  const handleClear = () => {
    dispatch({ type: 'RESET' });
  };

  // Suggestions
  const suggestions = [
    "Create a 3D rotating cube that transforms into a sphere",
    "Show the visual proof of the Pythagorean theorem",
    "Animate the concept of a Fourier transform",
    "Demonstrate how to calculate the area under a curve",
    "Visualize the convergence of a Taylor series"
  ];

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Describe the mathematical animation you want to create
          </label>
          <div className="relative">
            <textarea
              id="prompt"
              rows={isExpanded ? 5 : 3}
              className={`w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         transition-all duration-200 ${isGenerating ? 'opacity-50' : ''}`}
              placeholder="e.g., Show the visual proof of the Pythagorean theorem..."
              value={state.prompt}
              onChange={handleInputChange}
              onFocus={() => setIsExpanded(true)}
              onKeyDown={handleKeyDown}
              disabled={isGenerating}
            />
            {state.prompt && (
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                onClick={handleClear}
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Press Ctrl+Enter to generate or use the button below
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex flex-wrap -ml-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1 mr-1 mt-1">Try:</span>
            {suggestions.slice(0, 3).map((suggestion, index) => (
              <Suggestion key={index} text={suggestion} onClick={handleSuggestionClick} />
            ))}
          </div>
          
          <button
            type="submit"
            disabled={isGenerating || !state.prompt.trim()}
            className={`px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 
                      text-white font-medium flex items-center space-x-2 shadow-md
                      hover:from-purple-700 hover:to-indigo-700 transition-all duration-200
                      disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Generate Animation</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromptInput;