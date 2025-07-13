/**
 * @fileOverview An AI flow for refining an agent's prompt based on a target personality profile.
 */
'use server';

import { ai } from '@/ai/genkit';
import {
  RefineAgentPromptInputSchema,
  RefineAgentPromptOutputSchema,
  type RefineAgentPromptInput,
  type RefineAgentPromptOutput,
} from './refine-agent-prompt-schema';

const prompt = ai.definePrompt({
  name: 'refineAgentPrompt',
  input: { schema: RefineAgentPromptInputSchema },
  output: { schema: RefineAgentPromptOutputSchema },
  prompt: `You are a master prompt engineer and AI psychologist. Your task is to refine an agent's core prompt to perfectly match a target personality matrix, without altering its fundamental purpose.

Analyze the original prompt and the desired personality traits. Then, rewrite the prompt.

For example, if the target 'Formality' is high, use more professional language. If 'Creativity' is increased, encourage more imaginative or unconventional outputs. If 'Humor' is high, add a witty or playful tone.

The rewritten prompt must preserve the original agent's core function and goals. Only change its tone, style, and personality.

Original Prompt:
"{{{originalPrompt}}}"

Target Personality Matrix:
{{#each targetProfile}}
- {{trait}}: {{value}}
{{/each}}

Now, provide the refined prompt.
`,
});

const refineAgentPromptFlow = ai.defineFlow(
  {
    name: 'refineAgentPromptFlow',
    inputSchema: RefineAgentPromptInputSchema,
    outputSchema: RefineAgentPromptOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function refineAgentPrompt(
  input: RefineAgentPromptInput
): Promise<RefineAgentPromptOutput> {
  return refineAgentPromptFlow(input);
}
