
/**
 * @fileoverview The Prime Arsenal: The foundational styles for the Avataris Genesis Engine.
 * This file serves as the single source of truth for all available stylistic invocations.
 */

export const PrimeArsenalStyle = [
    'AETHER-GLASS', 
    'OBSIDIAN-SIGIL', 
    'GILDED-AUTOMATA', 
    'VERDIGRIS-RUNE'
] as const;
 
export type PrimeArsenalStyle = (typeof PrimeArsenalStyle)[number];

export interface ArsenalStyle {
    name: PrimeArsenalStyle;
    vibe: string;
    essence: string;
}

export const PrimeArsenal: ArsenalStyle[] = [
    {
        name: "AETHER-GLASS",
        vibe: "Ethereal, translucent, crystalline, spectral.",
        essence: "For agents of pure information, intellect, and insight. The physical manifestation of the 'Ancient Roman Glass' aesthetic."
    },
    {
        name: "OBSIDIAN-SIGIL",
        vibe: "Minimalist, brutalist, high-contrast, sharp lines.",
        essence: "The look of raw power, authority, and unshakeable will. The style of security sentinels and financial arbiters."
    },
    {
        name: "GILDED-AUTOMATA",
        vibe: "Intricate, mechanical, clockwork, ornate.",
        essence: "For agents of complex orchestration and workflow automation. The summoned spirit that is unapologetically a machine."
    },
    {
        name: "VERDIGRIS-RUNE",
        vibe: "Ancient, weathered, organic, forgotten knowledge.",
        essence: "For agents tied to legacy systems, user history, or adaptive intelligence. Evokes wisdom and emergent life."
    }
];
