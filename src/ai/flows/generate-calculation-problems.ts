'use server';
/**
 * @fileOverview A Genkit flow for generating various calculation problems.
 *
 * - generateCalculationProblems - A function that handles the generation of calculation problems.
 * - GenerateCalculationProblemsInput - The input type for the generateCalculationProblems function.
 * - GenerateCalculationProblemsOutput - The return type for the generateCalculationProblems function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema
const GenerateCalculationProblemsInputSchema = z.object({
  numProblems: z.number().int().min(1).describe('The number of calculation problems to generate.'),
});
export type GenerateCalculationProblemsInput = z.infer<typeof GenerateCalculationProblemsInputSchema>;

// Output Schema for a single calculation problem
const CalculationProblemSchema = z.object({
  question: z.string().describe('The calculation problem question.'),
  answer: z.number().describe('The correct numerical answer to the problem.'),
  type: z.enum(['basic_arithmetic', 'percentage', 'word_problem']).describe('The type of calculation problem.'),
});

// Output Schema for the entire flow
const GenerateCalculationProblemsOutputSchema = z.object({
  problems: z.array(CalculationProblemSchema).describe('An array of generated calculation problems.'),
});
export type GenerateCalculationProblemsOutput = z.infer<typeof GenerateCalculationProblemsOutputSchema>;

// Wrapper function to call the Genkit flow
export async function generateCalculationProblems(input: GenerateCalculationProblemsInput): Promise<GenerateCalculationProblemsOutput> {
  return generateCalculationProblemsFlow(input);
}

// Define the prompt for generating calculation problems
const generateCalculationProblemsPrompt = ai.definePrompt({
  name: 'generateCalculationProblemsPrompt',
  input: { schema: GenerateCalculationProblemsInputSchema },
  output: { schema: GenerateCalculationProblemsOutputSchema },
  prompt: `You are a math problem generator for a cognitive exam tryout. Your task is to create exactly {{numProblems}} unique calculation problems.
  Ensure a good mix of problem types: basic arithmetic, percentage calculations, and word problems that require mathematical reasoning.
  For each problem, provide the 'question' as a string, the 'answer' as a single numerical value, and the 'type' which must be one of 'basic_arithmetic', 'percentage', or 'word_problem'.
  Make sure the word problems are clear and concise. The arithmetic and percentage problems should be solvable.

  Example Output Structure:
  {
    "problems": [
      {
        "question": "What is 15% of 200?",
        "answer": 30,
        "type": "percentage"
      },
      {
        "question": "If a car travels at 60 km/h for 2.5 hours, how far does it travel?",
        "answer": 150,
        "type": "word_problem"
      },
      {
        "question": "Calculate: (12 + 8) * 3 - 5",
        "answer": 55,
        "type": "basic_arithmetic"
      }
    ]
  }
  Generate {{numProblems}} problems in total, wrapped in a JSON object with a 'problems' key.`,
});

// Define the Genkit flow for generating calculation problems
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
