
/**
 * @fileOverview This file is deprecated. Its functionality has been decoupled
 * into analyze-agent-profile-flow.ts and generate-agent-avatar-flow.ts
 * to support interactive agent creation. This file is retained to avoid
 * breaking changes in a larger refactor but should not be used for new development.
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
