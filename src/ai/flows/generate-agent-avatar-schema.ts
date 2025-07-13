/**
 * @fileOverview Schemas for generating an agent avatar.
 */
import { z } from 'zod';
import { AnalyzeAgentProfileOutputSchema } from './analyze-agent-profile-schema';
import { PrimeArsenalStyle } from '@/lib/styles';

export const GenerateAgentAvatarInputSchema = z.object({
  prompt: z.string().describe('The agent prompt to base the avatar on.'),
  profile: AnalyzeAgentProfileOutputSchema.shape.profile.optional().describe("An optional array of personality traits and their scores to further guide the avatar's visual style."),
  selectedStyle: z.enum(PrimeArsenalStyle).optional().describe('The chosen visual style from the Prime Arsenal.'),
});
export type GenerateAgentAvatarInput = z.infer<typeof GenerateAgentAvatarInputSchema>;

export const GenerateAgentAvatarOutputSchema = z.object({
  avatarDataUri: z.string().describe('The generated avatar image as a data URI.'),
});
export type GenerateAgentAvatarOutput = z.infer<typeof GenerateAgentAvatarOutputSchema>;
