
'use server';
/**
 * @fileOverview A Genkit flow for generating various calculation problems.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateCalculationProblemsInputSchema = z.object({
  numProblems: z.number().int().min(1).max(20).describe('The number of calculation problems to generate.'),
});
export type GenerateCalculationProblemsInput = z.infer<typeof GenerateCalculationProblemsInputSchema>;

const CalculationProblemSchema = z.object({
  question: z.string().describe('The calculation problem question.'),
  options: z.array(z.string()).length(4).describe('An array of 4 possible numerical answer options.'),
  answer: z.string().describe('The correct numerical answer which must be exactly one of the options.'),
  type: z.enum(['basic_arithmetic', 'percentage', 'word_problem']).describe('The type of calculation problem.'),
});

const GenerateCalculationProblemsOutputSchema = z.object({
  problems: z.array(CalculationProblemSchema).describe('An array of generated calculation problems.'),
});
export type GenerateCalculationProblemsOutput = z.infer<typeof GenerateCalculationProblemsOutputSchema>;

export async function generateCalculationProblems(input: GenerateCalculationProblemsInput): Promise<GenerateCalculationProblemsOutput> {
  return generateCalculationProblemsFlow(input);
}

const generateCalculationProblemsPrompt = ai.definePrompt({
  name: 'generateCalculationProblemsPrompt',
  input: { schema: GenerateCalculationProblemsInputSchema },
  output: { schema: GenerateCalculationProblemsOutputSchema },
  prompt: `You are a high-precision math problem generator for a cognitive test. 
  Create exactly {{numProblems}} unique calculation problems in Indonesian.
  Each problem MUST be multiple choice with exactly 4 options.
  The "answer" field MUST match one of the options exactly.
  
  Format:
  Question: "Berapakah 15% dari 200?"
  Options: ["20", "30", "40", "50"]
  Answer: "30"
  
  Output ONLY valid JSON.`,
});

const generateCalculationProblemsFlow = ai.defineFlow(
  {
    name: 'generateCalculationProblemsFlow',
    inputSchema: GenerateCalculationProblemsInputSchema,
    outputSchema: GenerateCalculationProblemsOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await generateCalculationProblemsPrompt(input);
      if (!output) throw new Error('AI returned empty output');
      return output;
    } catch (error: any) {
      console.error('Error in generateCalculationProblemsFlow:', error);
      throw new Error(`Gagal: ${error.message}`);
    }
  }
);
