import React from 'react';
import { Braces, Code2, GitPullRequest } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-purple-900 to-purple-700 text-white p-4 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <Code2 className="mr-2 h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">MathVizAI</h1>
            <p className="text-purple-200 text-sm">Transform ideas into mathematical animations</p>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button className="flex items-center px-3 py-2 rounded-md bg-purple-800 hover:bg-purple-600 transition-colors">
            <GitPullRequest className="mr-2 h-4 w-4" />
            <span>Examples</span>
          </button>
          <button className="flex items-center px-3 py-2 rounded-md bg-teal-600 hover:bg-teal-500 transition-colors">
            <Braces className="mr-2 h-4 w-4" />
            <span>Documentation</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;