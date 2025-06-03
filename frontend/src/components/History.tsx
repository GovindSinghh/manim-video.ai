import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Trash2 } from 'lucide-react';
import { useGenerateScript, useGeneration } from '../contexts/GenerationContext';

const History: React.FC = () => {
  const { history, clearHistory } = useGeneration();
  const { state, dispatch } = useGeneration();
  const { generate } = useGenerateScript();
  const [isExpanded, setIsExpanded] = useState(false);

  if (history.length === 0) {
    return null;
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300">
      <div 
        className="p-4 bg-gray-50 dark:bg-gray-700 cursor-pointer flex justify-between items-center"
        onClick={toggleExpanded}
      >
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <h3 className="font-medium text-gray-900 dark:text-white">Generation History</h3>
          <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded-full">
            {history.length}
          </span>
        </div>
        <button className="text-gray-500 dark:text-gray-400">
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>
      
      {isExpanded && (
        <div className="p-4">
          <div className="flex justify-end mb-2">
            <button
              onClick={clearHistory}
              className="flex items-center space-x-1 text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              <Trash2 className="h-3 w-3" />
              <span>Clear history</span>
            </button>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 hover:text-black-200 dark:hover:bg-gray-750 transition-colors cursor-pointer"
                onClick={()=>{
                  dispatch({ type:"SET_PROMPT",payload:item.prompt });
                  state.scriptId=item.id;
                  state.isHistory=true;
                  generate();
                }}
              >
                <p className="font-medium text-gray-900 dark:text-white">{item.prompt}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatDate(item.timestamp)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default History;