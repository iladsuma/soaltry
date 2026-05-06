'use server';
/**
 * @fileOverview A Genkit flow for generating general knowledge questions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateGeneralKnowledgeQuestionsInputSchema = z.object({
  topics: z
    .array(z.string())
    .describe('An array of topics for which to generate general knowledge questions.'),
  count: z
    .number()
    .int()
    .positive()
    .max(20)
    .describe('The number of questions to generate (max 20 per batch).'),
});
export type GenerateGeneralKnowledgeQuestionsInput = z.infer<typeof GenerateGeneralKnowledgeQuestionsInputSchema>;

const GenerateGeneralKnowledgeQuestionsOutputSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z.string().describe('The general knowledge question text.'),
        options: z.array(z.string()).length(4).describe('An array of exactly 4 possible answer options.'),
        answer: z
          .string()
          .describe('The exact text of the correct answer option from the provided options.'),
      })
    )
    .describe('An array of generated general knowledge questions.'),
});
export type GenerateGeneralKnowledgeQuestionsOutput = z.infer<typeof GenerateGeneralKnowledgeQuestionsOutputSchema>;

export async function generateGeneralKnowledgeQuestions(
  input: GenerateGeneralKnowledgeQuestionsInput
): Promise<GenerateGeneralKnowledgeQuestionsOutput> {
  return generateGeneralKnowledgeQuestionsFlow(input);
}

const generateGeneralKnowledgeQuestionsPrompt = ai.definePrompt({
  name: 'generateGeneralKnowledgeQuestionsPrompt',
  input: { schema: GenerateGeneralKnowledgeQuestionsInputSchema },
  output: { schema: GenerateGeneralKnowledgeQuestionsOutputSchema },
  prompt: `You are an expert at creating general knowledge questions for an intellectual exam.

Generate exactly {{{count}}} general knowledge questions based on these topics: {{{topics.join(', ')}}}.

Rules:
1. Each question must have exactly 4 distinct options.
2. The "answer" field must be the EXACT string of the correct option.
3. Questions should be varied, interesting, and appropriate for a professional cognitive test.
4. Output ONLY valid JSON following the provided schema.`,
});

const generateGeneralKnowledgeQuestionsFlow = ai.defineFlow(
  {
    name: 'generateGeneralKnowledgeQuestionsFlow',
    inputSchema: GenerateGeneralKnowledgeQuestionsInputSchema,
    outputSchema: GenerateGeneralKnowledgeQuestionsOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await generateGeneralKnowledgeQuestionsPrompt(input);
      if (!output || !output.questions || output.questions.length === 0) {
        throw new Error('AI returned an empty list of questions.');
      }
      return output;
    } catch (error: any) {
      console.error('Error in generateGeneralKnowledgeQuestionsFlow:', error);
      throw new Error(`Gagal menghasilkan soal pengetahuan umum: ${error.message || 'Cek koneksi/kuota'}`);
    }
  }
);
