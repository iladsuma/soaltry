'use server';
/**
 * @fileOverview A Genkit flow for generating Indonesian language questions (Sinonim, Antonim, Analogi).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateLanguageQuestionsInputSchema = z.object({
  count: z.number().int().min(1).max(20).describe('The number of language questions to generate.'),
});
export type GenerateLanguageQuestionsInput = z.infer<typeof GenerateLanguageQuestionsInputSchema>;

const LanguageQuestionSchema = z.object({
  question: z.string().describe('The language question text.'),
  options: z.array(z.string()).length(4).describe('An array of 4 possible answer options.'),
  answer: z.string().describe('The correct answer which must match one of the options exactly.'),
  category: z.enum(['sinonim', 'antonim', 'analogi', 'padanan_kata']).describe('The category of the question.'),
});

const GenerateLanguageQuestionsOutputSchema = z.object({
  questions: z.array(LanguageQuestionSchema).describe('An array of generated language questions.'),
});
export type GenerateLanguageQuestionsOutput = z.infer<typeof GenerateLanguageQuestionsOutputSchema>;

export async function generateLanguageQuestions(input: GenerateLanguageQuestionsInput): Promise<GenerateLanguageQuestionsOutput> {
  return generateLanguageQuestionsFlow(input);
}

const generateLanguageQuestionsPrompt = ai.definePrompt({
  name: 'generateLanguageQuestionsPrompt',
  input: { schema: GenerateLanguageQuestionsInputSchema },
  output: { schema: GenerateLanguageQuestionsOutputSchema },
  prompt: `You are an expert Indonesian linguist creating questions for a professional cognitive exam.
  Generate exactly {{count}} unique Indonesian language questions.
  
  Question categories to mix:
  - Sinonim (Persamaan Kata)
  - Antonim (Lawan Kata)
  - Analogi Kata (e.g., "Gergaji : Kayu = Pisau : ...")
  - Padanan Kata (Definisi/Arti kata baku)
  
  Rules:
  1. Each question MUST be in Indonesian.
  2. Each question MUST have exactly 4 options.
  3. The "answer" MUST be exactly one of the options.
  4. Use professional and academic vocabulary (Kata Baku).
  5. Output ONLY valid JSON.`,
});

const generateLanguageQuestionsFlow = ai.defineFlow(
  {
    name: 'generateLanguageQuestionsFlow',
    inputSchema: GenerateLanguageQuestionsInputSchema,
    outputSchema: GenerateLanguageQuestionsOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await generateLanguageQuestionsPrompt(input);
      if (!output || !output.questions || output.questions.length === 0) {
        throw new Error('AI returned an empty list of language questions.');
      }
      return output;
    } catch (error: any) {
      console.error('Error in generateLanguageQuestionsFlow:', error);
      throw new Error(`Gagal menghasilkan soal bahasa: ${error.message}`);
    }
  }
);
