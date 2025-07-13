/**
 * @fileOverview An AI flow for generating an agent avatar based on a prompt.
 * 
 * - generateAgentAvatar - A function that handles avatar generation.
 */
'use server';

import { ai } from '@/ai/genkit';
import { 
    GenerateAgentAvatarInputSchema, 
    GenerateAgentAvatarOutputSchema, 
    type GenerateAgentAvatarInput,
    type GenerateAgentAvatarOutput
} from './generate-agent-avatar-schema';

const prompt = ai.definePrompt({
    name: 'generateAgentAvatarPrompt',
    input: { schema: GenerateAgentAvatarInputSchema },
    prompt: `Generate a visually appealing and creative avatar for an AI agent. 
The avatar should be a stylized, high-quality vector-style illustration on a transparent background.
It should be a headshot or bust portrait.
    
Base the avatar's appearance and personality on the following agent description:
"{{{prompt}}}"

{{#if profile}}
To further refine the visual style, consider the following personality matrix where 0 is low and 100 is high:
{{#each profile}}
- {{trait}}: {{value}}
{{/each}}
A high "Creativity" or "Whimsy" score might suggest a more abstract or artistic style. A high "Formality" or "Technicality" score suggests a cleaner, more robotic or professional look.
{{/if}}
    `,
    config: {
        responseModalities: ['TEXT', 'IMAGE'],
    },
});

const generateAgentAvatarFlow = ai.defineFlow(
  {
    name: 'generateAgentAvatarFlow',
    inputSchema: GenerateAgentAvatarInputSchema,
    outputSchema: GenerateAgentAvatarOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      ...prompt(input),
    });
    
    if (!media || !media.url) {
      throw new Error('Image generation failed.');
    }

    return { avatarDataUri: media.url };
  }
);

export async function generateAgentAvatar(input: GenerateAgentAvatarInput): Promise<GenerateAgentAvatarOutput> {
  return generateAgentAvatarFlow(input);
}
