'use server';
/**
 * @fileOverview A Genkit flow for generating various calculation problems.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateCalculationProblemsInputSchema = z.object({
  numProblems: z.number().int().min(1).describe('The number of calculation problems to generate.'),
});
export type GenerateCalculationProblemsInput = z.infer<typeof GenerateCalculationProblemsInputSchema>;

const CalculationProblemSchema = z.object({
  question: z.string().describe('The calculation problem question.'),
  options: z.array(z.string()).describe('An array of 4 possible numerical answer options.'),
  answer: z.string().describe('The correct numerical answer which must be one of the options.'),
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
  prompt: `You are a math problem generator for a cognitive exam. 
  Create exactly {{numProblems}} unique calculation problems.
  Each problem must be multiple choice with 4 options.
  
  Example Output:
  {
    "problems": [
      {
        "question": "What is 15% of 200?",
        "options": ["20", "25", "30", "35"],
        "answer": "30",
        "type": "percentage"
      }
    ]
  }
  
  Generate {{numProblems}} varied problems.`,
});

const generateCalculationProblemsFlow = ai.defineFlow(
  {
    name: 'generateCalculationProblemsFlow',
    inputSchema: GenerateCalculationProblemsInputSchema,
    outputSchema: GenerateCalculationProblemsOutputSchema,
  },
  async (input) => {
    const { output } = await generateCalculationProblemsPrompt(input);
    if (!output) {
      throw new Error('Failed to generate calculation problems.');
    }
    return output;
  }
);
