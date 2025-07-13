/**
 * @fileOverview An AI flow for forging a new "Nexus" agent to bridge two existing agents.
 */
'use server';

import { ai } from '@/ai/genkit';
import {
  CreateNexusAgentInputSchema,
  CreateNexusAgentOutputSchema,
  type CreateNexusAgentInput,
  type CreateNexusAgentOutput,
} from './create-nexus-agent-schema';
import { analyzeAgentProfile } from './analyze-agent-profile-flow';
import { generateAgentAvatar } from './generate-agent-avatar-flow';
import { z } from 'zod';

const InventAgentSchema = z.object({
  purpose: z.string().describe("A brief, one-sentence description of the new agent's purpose, explaining how it bridges the source and target agents."),
  prompt: z.string().describe("A detailed, well-written prompt for the new agent that will enable it to fulfill its purpose. This prompt should be written from the perspective of instructing the new agent."),
});

const inventAgentPrompt = ai.definePrompt({
    name: 'inventNexusAgentPrompt',
    input: { schema: CreateNexusAgentInputSchema },
    output: { schema: InventAgentSchema },
    prompt: `You are a master systems architect for an advanced AI orchestration platform called Loom. Your task is to invent a new AI agent that can logically connect a 'source' agent and a 'target' agent in a workflow.

Analyze the prompts of the source and target agents to understand their functions. Then, devise a new agent that can act as a bridge between them.

For example, if the source agent generates a customer review and the target agent sends an email, the new agent you invent might be designed to analyze the sentiment of the review to decide *what kind* of email to send.

**Source Agent Prompt:**
"{{{sourcePrompt}}}"

**Target Agent Prompt:**
"{{{targetPrompt}}}"

Based on your analysis, define the new agent by providing its core purpose and a complete, well-formed prompt to power it.
`,
});

const createNexusAgentFlow = ai.defineFlow(
  {
    name: 'createNexusAgentFlow',
    inputSchema: CreateNexusAgentInputSchema,
    outputSchema: CreateNexusAgentOutputSchema,
  },
  async (input) => {
    // 1. Invent the new agent's purpose and prompt
    const { output: invention } = await inventAgentPrompt(input);
    if (!invention) {
        throw new Error("Could not invent a new agent.");
    }
    
    const newAgentPrompt = invention.prompt;

    // 2. Analyze the new agent's profile (name, traits, style)
    const profile = await analyzeAgentProfile({ prompt: newAgentPrompt });

    // 3. Generate an avatar for the new agent
    const avatar = await generateAgentAvatar({
        prompt: newAgentPrompt,
        profile: profile.profile,
        selectedStyle: profile.recommendedStyle,
    });

    // 4. Assemble the complete node data
    const newNodeData: CreateNexusAgentOutput = {
        id: `agent_nexus_${Date.now()}`,
        name: profile.name,
        type: "LLM Task Agent",
        avatarDataUri: avatar.avatarDataUri || '',
        dataAiHint: 'nexus icon',
        profile: profile.profile,
        position: { x: 0, y: 0 }, // Position will be set by the client
        prompt: newAgentPrompt,
        signature: 'unsigned',
        behavioralState: 'Idle',
    };

    return newNodeData;
  }
);

export async function createNexusAgent(
  input: CreateNexusAgentInput
): Promise<CreateNexusAgentOutput> {
  return createNexusAgentFlow(input);
}
