import { Question } from './types';

export const languageQuestions: Question[] = Array.from({ length: 35 }).map((_, i) => ({
  id: `lang-${i}`,
  type: 'language',
  question: `Manakah kata yang merupakan sinonim dari "${['Efisien', 'Inovatif', 'Persuasif', 'Konsisten'][i % 4]}"?`,
  options: ['Akurat', 'Tepat Guna', 'Cepat', 'Hemat'],
  answer: 'Tepat Guna',
}));

export const patternQuestions: Question[] = Array.from({ length: 36 }).map((_, i) => ({
  id: `pattern-${i}`,
  type: 'patterns',
  question: `Lanjutkan pola berikut: 1, 4, 9, 16, ...`,
  options: ['20', '25', '30', '36'],
  answer: '25',
}));

export const abstractionQuestions: Question[] = Array.from({ length: 36 }).map((_, i) => ({
  id: `abs-${i}`,
  type: 'abstraction',
  question: `Jika A adalah B dan B adalah C, maka pernyataan mana yang paling abstrak menggambarkan hubungan A ke C?`,
  options: ['Transitif', 'Refleksif', 'Simetris', 'Antisimetris'],
  answer: 'Transitif',
}));

export const spatialQuestions: Question[] = Array.from({ length: 36 }).map((_, i) => ({
  id: `spatial-${i}`,
  type: 'spatial',
  question: `Bayangkan kubus ini diputar 90 derajat searah jarum jam. Dimanakah posisi sisi yang sebelumnya menghadap atas?`,
  options: ['Kanan', 'Kiri', 'Belakang', 'Depan'],
  answer: 'Kanan',
}));