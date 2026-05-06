
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY,
    }),
  ],
  // Menggunakan model terbaru Gemini 2.0 Flash yang stabil
  model: 'googleai/gemini-2.0-flash',
});
