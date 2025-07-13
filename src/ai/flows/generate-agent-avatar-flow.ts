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
    prompt: `Generate a high-resolution, vector-style avatar for a "Sentinel" archetype AI agent. The avatar must be a unique, one-of-a-kind creation suitable for a UI component.

**Core Concept:** The design must embody extreme vigilance (100%), an unyielding nature (90%), precision (80%), and authority (70%). It must be a powerful, minimalist representation of a guardian.

**Artistic Style:** Strictly adhere to the **OBSIDIAN-SIGIL** style. This means:
-   **Form:** Use sharp, clean, geometric lines. The overall shape should be of a formidable, impenetrable helmet or bust. Think brutalist architecture translated into a character portrait.
-   **Color:** The primary material is a deep, polished obsidian black. Use high contrast and dramatic, hard-edged shadows to create a sense of depth and authority.
-   **Accents:** Use accents of 'Roman Aqua' and 'Imperial Purple' sparingly for glowing sigils or eye details. The glow should be contained and sharp, not soft or diffuse.

**Symbolic Motifs:**
-   **Threat-Detector:** Incorporate a single, focused, glowing optic or visor that represents a vigilant, all-seeing eye. It should feel like a scanner, perpetually active.
-   **Integrity-Guardian / Boundary-Enforcer:** Integrate sharp, shield-like plates or angular, interlocking geometric patterns into the form. The silhouette should feel like a fortress, communicating impenetrable defense and absolute control over boundaries. Avoid clutter; each line must serve the purpose of conveying strength.

**Final Image:** The output must be a headshot or bust on a transparent background, exuding a powerful and stoic presence.
    
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
A high "Vigilance" or "Authority" score suggests a more rigid and focused form. A high "Precision" score demands clean, sharp lines.
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
