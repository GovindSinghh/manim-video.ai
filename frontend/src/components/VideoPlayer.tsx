import React from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { useGeneration } from '../contexts/GenerationContext';

const VideoPlayer: React.FC = () => {
  const { state } = useGeneration();
  
  if (!state.videoUrl) {
    return (
      <div className="h-64 w-full bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400">
        <p>Generated animation will appear here</p>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-gray-900 dark:text-white">Generated Animation</h3>
        <div className="flex items-center space-x-2">
          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center space-x-1">
            <RefreshCw className="h-4 w-4" />
            <span className="text-xs">Regenerate</span>
          </button>
          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center space-x-1">
            <Download className="h-4 w-4" />
            <span className="text-xs">Download</span>
          </button>
        </div>
      </div>
      <div className="relative pt-[56.25%]"> {/* 16:9 aspect ratio */}
        <video
          className="absolute top-0 left-0 w-full h-full"
          src={state.videoUrl}
          controls
          autoPlay
          loop
        />
      </div>
    </div>
  );
};

export default VideoPlayer;