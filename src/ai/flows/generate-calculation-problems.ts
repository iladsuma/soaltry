
'use server';
/**
 * @fileOverview A Genkit flow for generating various calculation problems.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateCalculationProblemsInputSchema = z.object({
  numProblems: z.number().int().min(1).max(20).describe('The number of calculation problems to generate (max 20 per batch for stability).'),
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
  prompt: `You are a high-precision math problem generator for a cognitive exam. 
  Create exactly {{numProblems}} unique calculation problems.
  Each problem MUST be multiple choice with exactly 4 options.
  The "answer" field MUST match one of the options exactly.
  
  Types of problems to include:
  - Basic arithmetic (addition, subtraction, multiplication, division with 2-3 digits)
  - Percentages and fractions
  - Simple algebraic word problems
  
  Make questions challenging for adults but solvable within 20 seconds without a calculator.
  Output ONLY valid JSON following the schema.`,
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
      if (!output || !output.problems || output.problems.length === 0) {
        throw new Error('AI returned an empty list of problems.');
      }
      return output;
    } catch (error: any) {
      console.error('Error in generateCalculationProblemsFlow:', error);
      throw new Error(`Gagal menghasilkan soal hitungan: ${error.message || 'Cek koneksi/kuota'}`);
    }
  }
);
