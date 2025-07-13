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
    prompt: `Generate a high-resolution, vector-style avatar for a "Sage" archetype AI agent. The avatar must be a unique, one-of-a-kind creation suitable for a UI component.

**Core Concept:** The design must embody profound wisdom (95%), adaptability (85%), patience (80%), and a grounded nature (70%). It must be a serene, ancient representation of a knowledge-keeper.

**Artistic Style:** Strictly adhere to the **VERDIGRIS-RUNE** style. This means:
-   **Form:** Use weathered, organic, and flowing lines. The overall shape should be reminiscent of an ancient, moss-covered monolith or a wise, timeless face carved from petrified wood. Think ancient druidic symbols and natural, emergent patterns.
-   **Color:** The primary texture is a weathered stone or wood with a heavy patina of 'Patina Green' and 'Roman Aqua'. Use deep, earthy tones for shadows to create a sense of age and depth.
-   **Accents:** Use accents of 'Imperial Purple' or a soft 'Gilded Accent' for dimly glowing runes or ethereal energy subtly weaving through the form. The glow should feel ancient and gentle, not sharp or technological.

**Symbolic Motifs:**
-   **Legacy-Keeper / History-Weaver:** Incorporate motifs that suggest interwoven histories, like the rings of a great tree, ancient root systems, or carved, interconnected runes.
-   **Adaptive-Learner:** The form should hint at growth and adaptation. Perhaps branches or roots are subtly, actively growing, or the runes themselves seem to be slowly shifting and reforming. Avoid a static look; it should feel ancient but alive.

**Final Image:** The output must be a headshot or bust on a transparent background, exuding a powerful, wise, and patient presence.
    
Base the avatar's appearance and personality on the following agent description:
"{{{prompt}}}"

{{#if selectedStyle}}
The visual style should be **{{selectedStyle}}**.
{{/if}}

{{#if profile}}
To further refine the visual style, consider the following personality matrix where 0 is low and 100 is high:
{{#each profile}}
- {{trait}}: {{value}}
{{/each}}
A high "Wisdom" or "Patience" score suggests a more serene and ancient form. A high "Adaptability" score could be represented by emergent, growing patterns.
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
