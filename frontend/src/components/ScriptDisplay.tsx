import React, { useRef,useState } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import { useGeneration } from '../contexts/GenerationContext';

const ScriptDisplay: React.FC = () => {
  const { state } = useGeneration();
  const [copied, setCopied] = useState(false);
  const scriptRef = useRef<HTMLPreElement>(null);

  // useEffect(() => {
  //   // Simple syntax highlighting
  //   if (scriptRef.current && state.script) {
  //     const text = state.script;
  //     // Very basic Python syntax highlighting
  //     const highlighted = text
  //       .replace(/(class|def|from|import|return|self|for|in|if|else|while)\b/g, '<span class="text-purple-600">$1</span>')
  //       .replace(/(\s+)(\w+)\(/g, '$1<span class="text-blue-600">$2</span>(')
  //       .replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '<span class="text-amber-600">$&</span>')
  //       .replace(/(#.*)/g, '<span class="text-green-600">$1</span>');
      
  //     scriptRef.current.innerHTML = highlighted;
  //   }
  // }, [state.script]);

  const copyToClipboard = () => {
    if (!state.script) return;
    
    navigator.clipboard.writeText(state.script).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!state.script) {
    return (
      <div className="h-64 w-full bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400">
        <p>Generated Manim script will appear here</p>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-gray-900 dark:text-white">Generated Manim Script</h3>
        <button
          onClick={copyToClipboard}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center space-x-1"
        >
          {copied ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span className="text-xs">Copy code</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-auto max-h-[500px] custom-scrollbar">
        <pre ref={scriptRef} className="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{state.script}</pre>
      </div>
    </div>
  );
};

export default ScriptDisplay;