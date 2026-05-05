'use server';
/**
 * @fileOverview A Genkit flow for generating general knowledge questions.
 *
 * - generateGeneralKnowledgeQuestions - A function that handles the generation of general knowledge questions.
 * - GenerateGeneralKnowledgeQuestionsInput - The input type for the generateGeneralKnowledgeQuestions function.
 * - GenerateGeneralKnowledgeQuestionsOutput - The return type for the generateGeneralKnowledgeQuestions function.
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
    .default(5)
    .describe('The number of general knowledge questions to generate.'),
});
export type GenerateGeneralKnowledgeQuestionsInput = z.infer<typeof GenerateGeneralKnowledgeQuestionsInputSchema>;

const GenerateGeneralKnowledgeQuestionsOutputSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z.string().describe('The general knowledge question text.'),
        options: z.array(z.string()).describe('An array of 4 possible answer options.'),
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
  prompt: `You are an expert at creating general knowledge questions.

Generate {{{count}}} general knowledge questions based on the following topics: {{{topics.join(', ')}}}.

Each question should be a multiple-choice question with 4 distinct options and a single correct answer. Ensure the questions are diverse and cover various aspects of the given topics.

For each question, provide the question text, an array of four answer options, and the exact text of the correct answer option from the provided options.`,
});

const generateGeneralKnowledgeQuestionsFlow = ai.defineFlow(
  {
    name: 'generateGeneralKnowledgeQuestionsFlow',
    inputSchema: GenerateGeneralKnowledgeQuestionsInputSchema,
    outputSchema: GenerateGeneralKnowledgeQuestionsOutputSchema,
  },
  async (input) => {
    const { output } = await generateGeneralKnowledgeQuestionsPrompt(input);
    return output!;
  }
);
