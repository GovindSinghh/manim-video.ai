import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ScriptDisplay from './components/ScriptDisplay';
import VideoPlayer from './components/VideoPlayer';
import History from './components/History';
import Footer from './components/Footer';
import { GenerationProvider, useGeneration } from './contexts/GenerationContext';
import Signup from './components/Signup';
import './index.css';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';

const MainContent: React.FC = () => {
  const { state } = useGeneration();
  const hasResults = state.script && state.videoUrl;
  
  return (
    <main className="container mx-auto px-4 py-8 flex-grow">
      <section className="mb-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Transform Ideas into Mathematical Animations
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-8">
          Enter a prompt describing the mathematical concept or animation you want to visualize.
          Our AI will generate the Manim script and render a beautiful animation for you.
        </p>
        
        <div className="max-w-4xl mx-auto">
          <PromptInput />
        </div>
      </section>
      
      {state.status === 'generating' && (
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center p-12">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
              <div className="h-12 w-12 rounded-full border-4 border-teal-200 border-t-teal-600 animate-spin absolute top-2 left-2"></div>
            </div>
            <p className="mt-6 text-gray-700 dark:text-gray-300 font-medium">Generating your animation...</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This may take a few moments</p>
          </div>
        </div>
      )}
      
      {hasResults && (
        <section className="max-w-6xl mx-auto mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ScriptDisplay />
            <VideoPlayer />
          </div>
        </section>
      )}
      
      <section className="max-w-4xl mx-auto mb-10">
        <History />
      </section>
    </main>
  );
};

const Dashboard: React.FC = () => {
  return (
    <GenerationProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header />
        <MainContent />
        <Footer />
      </div>
    </GenerationProvider>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;