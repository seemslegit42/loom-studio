/**
 * @fileOverview An AI flow for analyzing changes between two agent prompts.
 *
 * - analyzePromptChange - A function that handles the prompt change analysis.
 */
'use server';

import {ai} from '@/ai/genkit';
import {
  AnalyzePromptChangeInputSchema,
  AnalyzePromptChangeOutputSchema,
  type AnalyzePromptChangeInput,
  type AnalyzePromptChangeOutput,
} from './analyze-prompt-change-schema';

const prompt = ai.definePrompt({
  name: 'analyzePromptChangePrompt',
  input: {schema: AnalyzePromptChangeInputSchema},
  output: {schema: AnalyzePromptChangeOutputSchema},
  prompt: `You are an expert in prompt engineering and AI agent behavior. 
  
Analyze the difference between the original and modified prompts provided. 
Focus on the resulting change in the AI agent's personality, capabilities, or response style.

Return a single, concise sentence that summarizes the most significant behavioral change.

Original Prompt:
{{{originalPrompt}}}

Modified Prompt:
{{{modifiedPrompt}}}
`,
});

const analyzePromptChangeFlow = ai.defineFlow(
  {
    name: 'analyzePromptChangeFlow',
    inputSchema: AnalyzePromptChangeInputSchema,
    outputSchema: AnalyzePromptChangeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function analyzePromptChange(
  input: AnalyzePromptChangeInput
): Promise<AnalyzePromptChangeOutput> {
  return analyzePromptChangeFlow(input);
}
