/**
 * @fileOverview Schemas for the agent prompt refinement flow.
 */
import { z } from 'zod';
import { AnalyzeAgentProfileOutputSchema } from './analyze-agent-profile-schema';

export const RefineAgentPromptInputSchema = z.object({
  originalPrompt: z.string().describe("The agent's current core prompt."),
  targetProfile: AnalyzeAgentProfileOutputSchema.shape.profile.describe(
    'The desired personality profile to which the prompt should be aligned.'
  ),
});
export type RefineAgentPromptInput = z.infer<
  typeof RefineAgentPromptInputSchema
>;

export const RefineAgentPromptOutputSchema = z.object({
  refinedPrompt: z
    .string()
    .describe(
      'The rewritten prompt that reflects the target personality while preserving the original function.'
    ),
});
export type RefineAgentPromptOutput = z.infer<
  typeof RefineAgentPromptOutputSchema
>;
