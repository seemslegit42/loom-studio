/**
 * @fileOverview Schemas for signing avatar data.
 */
import { z } from 'zod';

export const SignAvatarDataInputSchema = z.object({
  agentId: z.string().describe('The unique ID of the agent.'),
  timestamp: z.number().describe('The UNIX timestamp of the signing request.'),
  architectUid: z.string().describe("The unique ID of the architect performing the action."),
  avatarDataUri: z.string().describe('The data URI of the avatar being signed.'),
  personalityProfileHash: z.string().describe('A hash of the agent\'s personality profile.'),
});
export type SignAvatarDataInput = z.infer<typeof SignAvatarDataInputSchema>;

export const SignAvatarDataOutputSchema = z.object({
  signature: z.string().describe('The resulting cryptographic signature digest.'),
});
export type SignAvatarDataOutput = z.infer<typeof SignAvatarDataOutputSchema>;
