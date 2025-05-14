import React from 'react';
import { Github, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-6 px-4 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Manim Script Generator. All rights reserved.
          </p>
        </div>
        
        <div className="flex items-center space-x-6">
          <a 
            href="#" 
            className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <span className="flex items-center">
              <Github className="h-5 w-5 mr-1" />
              <span className="text-sm">GitHub</span>
            </span>
          </a>
          
          <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> using Manim & React
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;