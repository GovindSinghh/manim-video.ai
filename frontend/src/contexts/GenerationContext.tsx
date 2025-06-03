import React, { createContext, useContext, useReducer } from 'react';
import { GenerationState, GenerationAction, HistoryItem } from '../types';
import axios from 'axios';


const generateScript = async (prompt: string,scriptId:number): Promise<{script:string,videoUrl:string}> => {

  try {
    console.log(`Generating script for prompt: ${prompt}`);
    const token=localStorage.getItem('token');
    const response = await axios.get(`http://localhost:3000/api/generateScript?scriptId=${scriptId}`,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    });
    return response.data;
  } catch (error:any) {
    throw new Error('Failed to generate script. Please try again.');
  }
};

// Initial state
const initialState: GenerationState = {
  prompt: '',
  scriptId:null,
  status: 'idle',
  script: null,
  videoUrl: null,
  error: null,
  isHistory:false
};

// History initial state
const initialHistory: HistoryItem[] = [];

// Reducer function for generation state
const generationReducer = (state: GenerationState, action: GenerationAction): GenerationState => {
  switch (action.type) {
    case 'SET_PROMPT':
      return { ...state, prompt: action.payload };
    case 'START_GENERATION':
      return { ...state, status: 'generating', script: null, videoUrl: null, error: null };
    case 'GENERATION_SUCCESS':
      return {
        ...state,
        status: 'success',
        script: action.payload.script,
        videoUrl: action.payload.videoUrl,
        error: null
      };
    case 'GENERATION_ERROR':
      return { ...state, status: 'error', error: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

// Context setup
interface GenerationContextProps {
  state: GenerationState;
  dispatch: React.Dispatch<GenerationAction>;
  history: HistoryItem[];
  addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
}

const GenerationContext = createContext<GenerationContextProps | undefined>(undefined);

export const GenerationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(generationReducer, initialState);
  const [history, setHistory] = React.useState<HistoryItem[]>(initialHistory);
  const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    if(!state.scriptId){
      return;
    }
    const newItem: HistoryItem = {
      ...item,
      id: state.scriptId,
      timestamp: Date.now()
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <GenerationContext.Provider value={{ state, dispatch, history, addToHistory, clearHistory }}>
      {children}
    </GenerationContext.Provider>
  );
};

export const useGeneration = () => {
  const context = useContext(GenerationContext);
  if (context === undefined) {
    throw new Error('useGeneration must be used within a GenerationProvider');
  }
  return context;
};

export const useGenerateScript = () => {
  const { state, dispatch, addToHistory } = useGeneration();

  const generate = async () => {
    if (!state.prompt.trim()) {
      dispatch({ type: 'GENERATION_ERROR', payload: 'Please enter a prompt' });
      return;
    }

    if (!state.scriptId) {
      dispatch({ type: 'GENERATION_ERROR', payload: 'No script ID found. Please try again.' });
      return;
    }

    dispatch({ type: 'START_GENERATION' });

    try {
      const result = await generateScript(state.prompt, state.scriptId);
      dispatch({ type: 'GENERATION_SUCCESS', payload: result });
      if(!state.isHistory){ // if not in history, then add to history
        addToHistory({
          prompt: state.prompt,
          script: result.script,
          videoUrl: result.videoUrl
        });
      }
    } catch (error) {
      dispatch({
        type: 'GENERATION_ERROR',
        payload: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  };

  return { generate, isGenerating: state.status === 'generating' };
};