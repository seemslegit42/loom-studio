
'use client';
import { useState } from 'react';

/**
 * @typedef Variant
 * @description The visual theme variant of the sigil.
 * @property {'aegis'}
 * @property {'klepsydra'}
 * @property {'genesis'}
 */
export type Variant = 'aegis' | 'klepsydra' | 'genesis';
/**
 * @typedef Ritual
 * @description The animation state or "ritual" the sigil is performing.
 * @property {'summon'} - The initial, high-energy activation animation.
 * @property {'orchestrate'} - An active, processing state animation.
 * @property {'transmute'} - (Future use) A state for transformation animations.
 * @property {'idle'} - The default, low-energy ambient state.
 */
export type Ritual = 'summon' | 'orchestrate' | 'transmute' | 'idle';

/**
 * A custom hook to manage the state of the system's central sigil animation.
 * It provides the current variant and ritual, along with setters to change them.
 * This encapsulates the state logic for the `SigilRites` component.
 * @returns {{
 *   variant: Variant,
 *   ritual: Ritual,
 *   setVariant: React.Dispatch<React.SetStateAction<Variant>>,
 *   setRitual: React.Dispatch<React.SetStateAction<Ritual>>
 * }} The sigil state and its update functions.
 */
export function useSystemSigilState() {
  const [variant, setVariant] = useState<Variant>('klepsydra');
  const [ritual, setRitual] = useState<Ritual>('idle');

  return {
    variant,
    ritual,
    setVariant,
    setRitual,
  };
}

    
