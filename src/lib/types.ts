export type SubTestType = 
  | 'language' 
  | 'calculations' 
  | 'general_knowledge';

export interface Question {
  id: string;
  type: SubTestType;
  question: string;
  options?: string[];
  answer: string | number;
}

export interface SubTestConfig {
  id: SubTestType;
  name: string;
  duration: number; // in seconds
  totalQuestions: number;
}

export const SUBTESTS: SubTestConfig[] = [
  { id: 'language', name: 'Kemampuan Bahasa', duration: 420, totalQuestions: 76 },
  { id: 'calculations', name: 'Kemampuan Hitungan', duration: 420, totalQuestions: 76 },
  { id: 'general_knowledge', name: 'Pengetahuan Umum', duration: 420, totalQuestions: 76 },
];
