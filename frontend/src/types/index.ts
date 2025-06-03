export interface GenerationState {
  prompt: string;
  scriptId:number | null;
  status: 'idle' | 'generating' | 'success' | 'error';
  script: string | null;
  videoUrl: string | null;
  error: string | null;
  isHistory:boolean;
}

export type GenerationAction =
  | { type: 'SET_PROMPT'; payload: string }
  | { type: 'START_GENERATION' }
  | { type: 'GENERATION_SUCCESS'; payload: { script: string; videoUrl: string } }
  | { type: 'GENERATION_ERROR'; payload: string }
  | { type: 'RESET' };

export interface HistoryItem {
  id: number;
  prompt: string;
  script: string;
  videoUrl: string;
  timestamp: number;
}