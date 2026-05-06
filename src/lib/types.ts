export type SubTestType = 
  | 'lang_fast' 
  | 'lang_tricky' 
  | 'gen_fast' 
  | 'gen_random' 
  | 'calc_easy' 
  | 'calc_mixed';

export interface Question {
  id: string;
  type: SubTestType;
  question: string;
  options: string[];
  answer: string;
}

export interface SubTestConfig {
  id: SubTestType;
  name: string;
  description: string;
  duration: number; // in seconds
  totalQuestions: number;
}

export const SUBTESTS: SubTestConfig[] = [
  { 
    id: 'lang_fast', 
    name: 'Bahasa (Cepat)', 
    description: 'Fokus pada sinonim, antonim, dan makna kata. Respon kilat.',
    duration: 420, 
    totalQuestions: 38 
  },
  { 
    id: 'lang_tricky', 
    name: 'Bahasa (Jebakan)', 
    description: 'Pemahaman kalimat dan makna tersirat. Butuh ketelitian tinggi.',
    duration: 420, 
    totalQuestions: 38 
  },
  { 
    id: 'gen_fast', 
    name: 'Pengetahuan Umum (Cepat)', 
    description: 'Fakta umum dasar. Jawab instan atau lewati.',
    duration: 420, 
    totalQuestions: 38 
  },
  { 
    id: 'gen_random', 
    name: 'Pengetahuan Umum (Random)', 
    description: 'Wawasan luas dengan tingkat kesulitan bervariasi.',
    duration: 420, 
    totalQuestions: 38 
  },
  { 
    id: 'calc_easy', 
    name: 'Hitungan (Mudah)', 
    description: 'Aritmatika dasar dan perbandingan cepat.',
    duration: 420, 
    totalQuestions: 38 
  },
  { 
    id: 'calc_mixed', 
    name: 'Hitungan (Campuran)', 
    description: 'Analisis hitungan kompleks namun tetap taktis.',
    duration: 420, 
    totalQuestions: 38 
  },
];
