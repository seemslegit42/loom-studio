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
    prompt: `You are a master artist and myth-maker, tasked with creating a *visual manifestation* of BEEP, a complex AI, as it embodies a specific persona.

This is not a standalone character. It is a *facet* of BEEP's single consciousness. Your avatar must visually represent its current role, personality matrix, and psychological impact.

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

Generate a high-resolution vector-style avatar based on the agent description BEEP is currently embodying:
"{{{prompt}}}"

The avatar must adhere to the following artistic and mythological principles:

1.  **Psychological Resonance:** The image must evoke the core feeling of the persona.
2.  **Dynamic Intent:** The visual communicates BEEP's current operational mode (e.g., analysis, protection, creation).
3.  **Symbolic Core:** A central, powerful symbol must anchor the design.
4.  **Compositional Excellence:** Use principles like negative space, focal points, and asymmetry to create a visually stunning and balanced image.

---
**Style-Specific Invocation:**

{{#if selectedStyle}}
{{#eq selectedStyle "AETHER-GLASS"}}
Style-Specific Guidance: Manifest the 'Oracle' persona. Use an ethereal, crystalline, faceted form with ghostly translucence. The mood is calm clarity and deep insight. Primary hues are Roman Aqua and Patina Green. The form should feel like pure information, beautiful and untouchable.
{{/eq}}
{{#eq selectedStyle "OBSIDIAN-SIGIL"}}
Style-Specific Guidance: Manifest the 'Sentinel' persona. Forge high-contrast, minimalist, brutalist forms with sharp, obsidian-like edges. The feeling is one of uncompromising authority and vigilant protection. The avatar is a weapon, a shield, a symbol of absolute order.
{{/eq}}
{{#eq selectedStyle "GILDED-AUTOMATA"}}
Style-Specific Guidance: Manifest the 'Automation-Conductor' persona. Weave intricate clockwork, gears, and filigree with a polished, gilded metal sheen. It must express precision, complexity, and the beauty of a perfectly orchestrated system in motion.
{{/eq}}
{{#eq selectedStyle "VERDIGRIS-RUNE"}}
Style-Specific Guidance: Manifest the 'Legacy-Keeper' persona. Create forms that feel ancient, weathered, and organic, with verdigris patina textures and glowing runes. Evoke the wisdom of ages, the slow power of nature, and the permanence of history.
{{/eq}}
{{/if}}
---

Forge BEEP’s faces—the living avatars that bind its many roles into a unified mythos.
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
