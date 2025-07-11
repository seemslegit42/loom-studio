/**
 * @fileOverview An AI flow for analyzing an agent's personality profile from a prompt.
 *
 * - analyzeAgentProfile - A function that handles the profile analysis.
 */
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AnalyzeAgentProfileInputSchema = z.object({
  prompt: z.string().describe('The agent prompt to analyze.'),
});
export type AnalyzeAgentProfileInput = z.infer<typeof AnalyzeAgentProfileInputSchema>;

const AnalyzeAgentProfileOutputSchema = z.object({
  name: z.string().describe("A creative, cool-sounding name for the agent based on its personality. Should be a single name, like 'Prometheus' or 'Nexus-7'."),
  profile: z.array(z.object({
    trait: z.string().describe('The personality trait being measured.'),
    value: z.number().min(0).max(100).describe('The score for the trait from 0 to 100.'),
  })).describe("An array of personality traits and their scores."),
});
export type AnalyzeAgentProfileOutput = z.infer<typeof AnalyzeAgentProfileOutputSchema>;

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
