/**
 * @fileOverview Schemas and types for the agent identity forging flow.
 */
import { z } from 'genkit';
import { AnalyzeAgentProfileOutputSchema } from './analyze-agent-profile-schema';
import { GenerateAgentAvatarOutputSchema } from './generate-agent-avatar-schema';

export const ForgeAgentIdentityInputSchema = z.object({
  prompt: z.string().describe("The agent's core prompt."),
});
export type ForgeAgentIdentityInput = z.infer<
  typeof ForgeAgentIdentityInputSchema
>;

export const ForgeAgentIdentityOutputSchema = z.object({
  name: AnalyzeAgentProfileOutputSchema.shape.name,
  profile: AnalyzeAgentProfileOutputSchema.shape.profile,
  avatarDataUri: GenerateAgentAvatarOutputSchema.shape.avatarDataUri,
});

export type ForgeAgentIdentityOutput = z.infer<
  typeof ForgeAgentIdentityOutputSchema
>;
