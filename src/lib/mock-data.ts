import { Question } from './types';

// Helper untuk variasi bahasa
const languagePool = [
  { q: 'Sinonim dari "Efisien"', o: ['Tepat Guna', 'Hemat', 'Cepat', 'Berdaya'], a: 'Tepat Guna' },
  { q: 'Antonim dari "Progresif"', o: ['Stagnan', 'Maju', 'Aktif', 'Regresif'], a: 'Regresif' },
  { q: 'Padanan kata dari "Iterasi"', o: ['Perulangan', 'Pembagian', 'Pengurangan', 'Penjumlahan'], a: 'Perulangan' },
  { q: 'Sinonim dari "Inovatif"', o: ['Kebaruan', 'Kuno', 'Tradisional', 'Usang'], a: 'Kebaruan' },
  { q: 'Kata yang tidak baku adalah...', o: ['Izin', 'Analisa', 'Sistem', 'Hierarki'], a: 'Analisa' },
  { q: 'Padanan kata "Paradoks"', o: ['Pertentangan', 'Kesamaan', 'Kesejajaran', 'Kedekatan'], a: 'Pertentangan' },
  { q: 'Sinonim dari "Ambigu"', o: ['Bermakna ganda', 'Jelas', 'Pasti', 'Terang'], a: 'Bermakna ganda' },
  { q: 'Antonim dari "Sekuler"', o: ['Duniawi', 'Agamis', 'Netral', 'Bebas'], a: 'Agamis' },
];

export const languageQuestions: Question[] = Array.from({ length: 35 }).map((_, i) => {
  const item = languagePool[i % languagePool.length];
  return {
    id: `lang-${i}`,
    type: 'language',
    question: `${i + 1}. ${item.q}?`,
    options: item.o,
    answer: item.a,
  };
});

// Helper untuk pola
const patternPool = [
  { q: '1, 4, 9, 16, ...', o: ['20', '25', '30', '36'], a: '25' },
  { q: '2, 4, 8, 16, ...', o: ['24', '30', '32', '64'], a: '32' },
  { q: '100, 90, 81, 73, ...', o: ['66', '65', '64', '60'], a: '66' },
  { q: 'A, C, E, G, ...', o: ['H', 'I', 'J', 'K'], a: 'I' },
  { q: '1, 1, 2, 3, 5, 8, ...', o: ['10', '11', '12', '13'], a: '13' },
];

export const patternQuestions: Question[] = Array.from({ length: 36 }).map((_, i) => {
  const item = patternPool[i % patternPool.length];
  return {
    id: `pattern-${i}`,
    type: 'patterns',
    question: `Lanjutkan pola berikut: ${item.q}`,
    options: item.o,
    answer: item.a,
  };
});

// Helper untuk abstraksi
const abstractionPool = [
  { q: 'Jika semua M adalah P, dan sebagian S adalah M, maka...', o: ['Semua S adalah P', 'Sebagian S adalah P', 'Tidak ada S yang P', 'Semua P adalah S'], a: 'Sebagian S adalah P' },
  { q: 'A > B, B < C, C = D. Hubungan A dan D adalah...', o: ['A > D', 'A < D', 'A = D', 'Tidak dapat ditentukan'], a: 'Tidak dapat ditentukan' },
  { q: 'Analogi: Haus : Air = Lapar : ...', o: ['Makan', 'Nasi', 'Haus', 'Kenyang'], a: 'Nasi' },
  { q: 'Premis: Semua guru adalah sabar. Budi adalah guru.', o: ['Budi sabar', 'Budi tidak sabar', 'Budi mungkin sabar', 'Guru sabar'], a: 'Budi sabar' },
];

export const abstractionQuestions: Question[] = Array.from({ length: 36 }).map((_, i) => {
  const item = abstractionPool[i % abstractionPool.length];
  return {
    id: `abs-${i}`,
    type: 'abstraction',
    question: item.q,
    options: item.o,
    answer: item.a,
  };
});

// Helper untuk spasial
const spatialPool = [
  { q: 'Kubus diputar 90 derajat ke kanan, sisi atas menjadi sisi...', o: ['Kanan', 'Kiri', 'Depan', 'Belakang'], a: 'Kanan' },
  { q: 'Jika cermin diletakkan di bawah objek, bayangan akan...', o: ['Terbalik vertikal', 'Terbalik horizontal', 'Tetap sama', 'Miring'], a: 'Terbalik vertikal' },
  { q: 'Manakah bangun yang berbeda dari yang lain?', o: ['Lingkaran', 'Elips', 'Bola', 'Persegi'], a: 'Persegi' },
];

export const spatialQuestions: Question[] = Array.from({ length: 36 }).map((_, i) => {
  const item = spatialPool[i % spatialPool.length];
  return {
    id: `spatial-${i}`,
    type: 'spatial',
    question: item.q,
    options: item.o,
    answer: item.a,
  };
});
