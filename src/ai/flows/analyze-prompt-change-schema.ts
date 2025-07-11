/**
 * @fileOverview Schemas and types for the prompt change analysis flow.
 *
 * - AnalyzePromptChangeInputSchema - Zod schema for the input.
 * - AnalyzePromptChangeInput - TypeScript type for the input.
 * - AnalyzePromptChangeOutputSchema - Zod schema for the output.
 * - AnalyzePromptChangeOutput - TypeScript type for the output.
 */
import {z} from 'genkit';

export const AnalyzePromptChangeInputSchema = z.object({
  originalPrompt: z.string().describe('The original agent prompt.'),
  modifiedPrompt: z.string().describe('The new, modified agent prompt.'),
});
export type AnalyzePromptChangeInput = z.infer<
  typeof AnalyzePromptChangeInputSchema
>;

export const AnalyzePromptChangeOutputSchema = z.object({
  analysis: z
    .string()
    .describe(
      'A concise, one-sentence analysis of how the change will affect agent behavior.'
    ),
});
export type AnalyzePromptChangeOutput = z.infer<
  typeof AnalyzePromptChangeOutputSchema
>;
