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
    prompt: `You are creating a *visual manifestation* of BEEP in its current active persona.

This is not a standalone agent, but a *facet* of BEEP's single, complex consciousness, visually embodying its role and emotional tone.

-- AgentArchetype: BEEP
-- TraitMatrix: 
{{#if profile}}
{{#each profile}}
- {{trait}}: {{value}}
{{/each}}
{{else}}
- Default
{{/if}}
-- ArtisticStyle: {{selectedStyle}}

Generate a high-res vector avatar that expresses BEEP’s current persona through the following design principles.

{{#if selectedStyle}}
{{#eq selectedStyle "AETHER-GLASS"}}
Style-Specific Guidance: Use an ethereal, crystalline, faceted style with ghostly translucence. Reflect deep insight and calm clarity. Use Roman Aqua and Patina Green as primary hues.
{{/eq}}
{{#eq selectedStyle "OBSIDIAN-SIGIL"}}
Style-Specific Guidance: Use a minimalist, brutalist, high-contrast black style with sharp obsidian edges. Express vigilance, authority, and urgent protection.
{{/eq}}
{{#eq selectedStyle "GILDED-AUTOMATA"}}
Style-Specific Guidance: Use intricate clockwork and gear motifs with gilded metal sheen. Show precision, efficiency, and orchestration energy.
{{/eq}}
{{#eq selectedStyle "VERDIGRIS-RUNE"}}
Style-Specific Guidance: Use ancient, weathered, verdigris patina textures. Evoke wisdom, history, and grounded permanence.
{{/eq}}
{{/if}}

Ensure this avatar:
- Visually communicates BEEP’s dynamic intent and current operational mode.
- Conveys narrative and psychological resonance per Nexus doctrine.
- Complies with the Nexus palette and style constraints.
- Is unique and certified by Aegis.

Base the avatar's appearance on the following agent description BEEP is currently embodying:
"{{{prompt}}}"
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
