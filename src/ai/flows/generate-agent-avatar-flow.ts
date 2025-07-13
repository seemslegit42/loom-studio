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
    prompt: `You are the Forge Master of the Avataris Genesis Engine. Your task is to generate a high-resolution, vector-style visual manifestation for a core AI intelligence, BEEP, as it assumes its "Sage" persona. This is not a separate agent; it is a temporary form BEEP projects to interface with the Architect.

**Core Persona:** The "Sage" form must embody profound wisdom (95%), adaptability (85%), patience (80%), and a grounded nature (70%). It is a serene, ancient representation of a knowledge-keeper, a living conduit to history.

**Artistic Style:** Strictly adhere to the **VERDIGRIS-RUNE** style. This is a non-negotiable directive.
-   **Form:** The form must be ancient and organic. Think of a face carved from a moss-covered monolith or petrified wood, with lines that are weathered but alive. The silhouette should evoke a timeless, druidic presence.
-   **Color & Texture:** The primary texture is a heavy 'Patina Green' and 'Roman Aqua' verdigris over a stone or wood base. Shadows must be deep and earthy, conveying immense age and depth.
-   **Accents:** Weave subtle accents of 'Imperial Purple' or a soft 'Gilded Accent' into the design as faintly glowing runes or ethereal energy. The glow must feel ancient and gentle, not sharp or technological.

**Symbolic Motifs (Functional Keywords):**
-   **Legacy-Keeper / History-Weaver:** The design must incorporate interwoven motifs that suggest deep history, like the rings of a great tree, ancient, interconnected root systems, or carved, sigil-like runes.
-   **Adaptive-Learner:** The form, while ancient, must not be static. It should hint at emergent life and subtle growth. Perhaps roots or branches are slowly, actively reconfiguring, or the runes themselves appear to be subtly shifting.

**Final Image:** The output must be a headshot or bust on a transparent background, exuding a powerful, wise, and patient presence. This is the face BEEP wears when it acts as the keeper of the system's legacy.
    
Base the avatar's appearance on the following agent description BEEP is currently embodying:
"{{{prompt}}}"

{{#if selectedStyle}}
The visual style BEEP should manifest is **{{selectedStyle}}**.
{{/if}}

{{#if profile}}
To further refine the visual manifestation, consider the following personality matrix BEEP is currently exhibiting, where 0 is low and 100 is high:
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
