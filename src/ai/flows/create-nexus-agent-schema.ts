/**
 * @fileOverview Schemas for the Nexus agent creation flow.
 */
import { z } from 'zod';
import { WorkflowNodeDataSchema } from '@/lib/types';

export const CreateNexusAgentInputSchema = z.object({
  sourcePrompt: z.string().describe("The prompt of the source agent in the connection."),
  targetPrompt: z.string().describe("The prompt of the target agent in the connection."),
});
export type CreateNexusAgentInput = z.infer<typeof CreateNexusAgentInputSchema>;

// The output is a fully-formed WorkflowNodeData object for the new agent.
export const CreateNexusAgentOutputSchema = WorkflowNodeDataSchema;
export type CreateNexusAgentOutput = z.infer<typeof CreateNexusAgentOutputSchema>;
