/**
 * @fileOverview An AI flow for analyzing an agent's personality profile from a prompt.
 *
 * - analyzeAgentProfile - A function that handles the profile analysis.
 */
'use server';

import { ai } from '@/ai/genkit';
import {
  AnalyzeAgentProfileInputSchema,
  AnalyzeAgentProfileOutputSchema,
  type AnalyzeAgentProfileInput,
  type AnalyzeAgentProfileOutput,
} from './analyze-agent-profile-schema';

const prompt = ai.definePrompt({
  name: 'analyzeAgentProfilePrompt',
  input: { schema: AnalyzeAgentProfileInputSchema },
  output: { schema: AnalyzeAgentProfileOutputSchema },
  prompt: `You are an expert in branding and personality analysis for AI agents. 
  
Analyze the provided agent prompt and perform two tasks:
1.  Come up with a creative, cool-sounding name for the agent. It should be a single name or a name with a number, like 'Oracle' or 'Pathfinder-3'.
2.  Rate the agent's personality on a scale of 0 to 100 for each of the following traits: "Creativity", "Humor", "Formality", "Enthusiasm", "Technicality", "Whimsy". A score of 0 means the trait is completely absent, and 100 means it is extremely prominent.

Agent Prompt:
{{{prompt}}}
`,
});

const analyzeAgentProfileFlow = ai.defineFlow(
  {
    name: 'analyzeAgentProfileFlow',
    inputSchema: AnalyzeAgentProfileInputSchema,
    outputSchema: AnalyzeAgentProfileOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function analyzeAgentProfile(
  input: AnalyzeAgentProfileInput
): Promise<AnalyzeAgentProfileOutput> {
  return analyzeAgentProfileFlow(input);
}
