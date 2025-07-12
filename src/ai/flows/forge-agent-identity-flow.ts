/**
 * @fileOverview An AI flow for forging a complete agent identity, including profile and avatar.
 *
 * - forgeAgentIdentity - A function that orchestrates the agent identity creation.
 */
'use server';

import { ai } from '@/ai/genkit';
import {
  ForgeAgentIdentityInputSchema,
  ForgeAgentIdentityOutputSchema,
  type ForgeAgentIdentityInput,
  type ForgeAgentIdentityOutput,
} from './forge-agent-identity-schema';
import { analyzeAgentProfile } from './analyze-agent-profile-flow';
import { generateAgentAvatar } from './generate-agent-avatar-flow';

const forgeAgentIdentityFlow = ai.defineFlow(
  {
    name: 'forgeAgentIdentityFlow',
    inputSchema: ForgeAgentIdentityInputSchema,
    outputSchema: ForgeAgentIdentityOutputSchema,
  },
  async (input) => {
    const [profile, avatar] = await Promise.all([
      analyzeAgentProfile({ prompt: input.prompt }),
      generateAgentAvatar({ prompt: input.prompt }),
    ]);

    return {
      name: profile.name,
      profile: profile.profile,
      avatarDataUri: avatar.avatarDataUri,
    };
  }
);

export async function forgeAgentIdentity(
  input: ForgeAgentIdentityInput
): Promise<ForgeAgentIdentityOutput> {
  return forgeAgentIdentityFlow(input);
}
