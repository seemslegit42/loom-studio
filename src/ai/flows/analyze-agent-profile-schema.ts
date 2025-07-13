/**
 * @fileOverview Schemas for analyzing an agent's personality profile from a prompt.
 */
import { z } from 'zod';
import { PrimeArsenalStyle } from '@/lib/styles';

export const AnalyzeAgentProfileInputSchema = z.object({
  prompt: z.string().describe('The agent prompt to analyze.'),
});
export type AnalyzeAgentProfileInput = z.infer<typeof AnalyzeAgentProfileInputSchema>;

export const AnalyzeAgentProfileOutputSchema = z.object({
  name: z.string().describe("A creative, cool-sounding name for the agent based on its personality. Should be a single name, like 'Prometheus' or 'Nexus-7'."),
  profile: z.array(z.object({
    trait: z.string().describe('The personality trait being measured.'),
    value: z.number().min(0).max(100).describe('The score for the trait from 0 to 100.'),
  })).describe("An array of personality traits and their scores."),
  recommendedStyle: z.enum(PrimeArsenalStyle).describe("The recommended visual style from the Prime Arsenal based on the agent's prompt."),
});
export type AnalyzeAgentProfileOutput = z.infer<typeof AnalyzeAgentProfileOutputSchema>;
