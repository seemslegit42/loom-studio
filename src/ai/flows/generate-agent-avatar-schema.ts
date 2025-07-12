/**
 * @fileOverview Schemas for generating an agent avatar.
 */
import { z } from 'zod';

export const GenerateAgentAvatarInputSchema = z.object({
  prompt: z.string().describe('The agent prompt to base the avatar on.'),
});
export type GenerateAgentAvatarInput = z.infer<typeof GenerateAgentAvatarInputSchema>;

export const GenerateAgentAvatarOutputSchema = z.object({
  avatarDataUri: z.string().describe('The generated avatar image as a data URI.'),
});
export type GenerateAgentAvatarOutput = z.infer<typeof GenerateAgentAvatarOutputSchema>;
