/**
 * @fileOverview An AI flow for cryptographically signing avatar data.
 *
 * - signAvatarData - A function that handles the data signing.
 */
'use server';
import crypto from 'crypto';
import { ai } from '@/ai/genkit';
import {
  SignAvatarDataInputSchema,
  SignAvatarDataOutputSchema,
  type SignAvatarDataInput,
  type SignAvatarDataOutput,
} from './sign-avatar-data-schema';

// This is a pure data processing flow, not an LLM call.
// It simulates signing data by creating a cryptographic hash.
const signAvatarDataFlow = ai.defineFlow(
  {
    name: 'signAvatarDataFlow',
    inputSchema: SignAvatarDataInputSchema,
    outputSchema: SignAvatarDataOutputSchema,
  },
  async (input) => {
    const dataToSign = [
      input.agentId,
      input.timestamp,
      input.architectUid,
      input.avatarDataUri,
      input.personalityProfileHash,
    ].join('::');

    const signature = crypto
      .createHash('sha256')
      .update(dataToSign)
      .digest('hex');

    return { signature: `aegis-sig-${signature}` };
  }
);

export async function signAvatarData(
  input: SignAvatarDataInput
): Promise<SignAvatarDataOutput> {
  return signAvatarDataFlow(input);
}
