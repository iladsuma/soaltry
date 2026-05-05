export type SubTestType = 
  | 'language' 
  | 'calculations' 
  | 'general_knowledge' 
  | 'patterns' 
  | 'abstraction' 
  | 'spatial';

export interface Question {
  id: string;
  type: SubTestType;
  question: string;
  options?: string[];
  answer: string | number;
  imageHint?: string;
  imageUrl?: string;
}

export interface SubTestConfig {
  id: SubTestType;
  name: string;
  duration: number; // in seconds
  totalQuestions: number;
}

export interface ExamState {
  currentSubTestIndex: number;
  currentQuestionIndex: number;
  answers: Record<string, string | number>;
  timeRemaining: number;
  status: 'idle' | 'running' | 'completed';
}

export const SUBTESTS: SubTestConfig[] = [
  { id: 'language', name: 'Bahasa', duration: 420, totalQuestions: 35 },
  { id: 'calculations', name: 'Hitungan', duration: 420, totalQuestions: 35 },
  { id: 'general_knowledge', name: 'Pengetahuan Umum', duration: 420, totalQuestions: 50 },
  { id: 'patterns', name: 'Pola Gambar', duration: 420, totalQuestions: 36 },
  { id: 'abstraction', name: 'Abstraksi', duration: 420, totalQuestions: 36 },
  { id: 'spatial', name: 'Ruang dan Bentuk', duration: 420, totalQuestions: 36 },
];