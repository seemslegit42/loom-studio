
/**
 * @fileOverview An AI flow for generating a full agentic workflow from a single natural language prompt.
 */
'use server';

import { ai } from '@/ai/genkit';
import {
  GenerateWorkflowFromPromptInputSchema,
  GenerateWorkflowFromPromptOutputSchema,
  type GenerateWorkflowFromPromptInput,
  type GenerateWorkflowFromPromptOutput,
} from './generate-workflow-from-prompt-schema';
import { workflowNodeCodex } from '@/lib/codex';

// Provide the AI with a manifest of available tools (nodes)
const nodeManifest = workflowNodeCodex
  .filter(node => node.family !== 'Archetype') // Archetypes are for starting, not for building blocks
  .map(node => `- ${node.devLabel}: ${node.tooltip}`)
  .join('\n');


const prompt = ai.definePrompt({
  name: 'generateWorkflowFromPrompt',
  input: { schema: GenerateWorkflowFromPromptInputSchema },
  output: { schema: GenerateWorkflowFromPromptOutputSchema },
  prompt: `You are a master systems architect for an advanced AI orchestration platform called Loom. Your task is to design and output a complete agentic workflow based on a high-level user request.

Analyze the user's prompt and break it down into a logical sequence of operations. For each operation, you must select the most appropriate node from the provided manifest.

**Node Manifest (Available Tools):**
${nodeManifest}

**Your Task:**
1.  Deconstruct the user's request into a series of steps.
2.  For each step, choose the best node from the manifest.
3.  Invent a creative, cool-sounding name for each agent node you create.
4.  Write a clear, concise prompt for each agent that instructs it on its specific task within the workflow.
5.  Define the connections (edges) between the nodes to create a valid, directed graph representing the workflow logic.
6.  Generate an initial position (x, y coordinates from 0 to 100) for each node to create a visually pleasing and logical layout on a 2D canvas. The layout should flow from left to right.
7.  Return the entire workflow as a single JSON object matching the output schema. Ensure all node IDs are unique strings.

**User's Request:**
"{{{prompt}}}"

Now, provide the complete workflow definition in the specified JSON format.
`,
});

const generateWorkflowFromPromptFlow = ai.defineFlow(
  {
    name: 'generateWorkflowFromPromptFlow',
    inputSchema: GenerateWorkflowFromPromptInputSchema,
    outputSchema: GenerateWorkflowFromPromptOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Could not generate a workflow from the prompt.');
    }
    
    // Post-processing to fill in default/missing values
    const finalOutput: GenerateWorkflowFromPromptOutput = {
        nodes: output.nodes.map(node => ({
            ...node,
            id: node.id || `agent_${Math.random().toString(36).substring(2, 9)}`,
            avatarDataUri: 'https://placehold.co/96x96.png', // Placeholder avatar
            dataAiHint: 'technology icon',
            profile: [ // Default profile
                { trait: 'Creativity', value: 50 },
                { trait: 'Humor', value: 50 },
                { trait: 'Formality', value: 50 },
                { trait: 'Enthusiasm', value: 50 },
                { trait: 'Technicality', value: 50 },
                { trait: 'Whimsy', value: 50 },
            ],
            signature: 'unsigned',
            behavioralState: 'Idle',
        })),
        connections: output.connections || [],
    };

    return finalOutput;
  }
);

export async function generateWorkflowFromPrompt(
  input: GenerateWorkflowFromPromptInput
): Promise<GenerateWorkflowFromPromptOutput> {
  return generateWorkflowFromPromptFlow(input);
}
