
'use client';
import { useState } from 'react';
import type { Ritual, Variant } from '@/components/sigil-rites/SigilRites';

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
  const [variant, setVariant] = useState<Variant>('genesis');
  const [ritual, setRitual] = useState<Ritual>('idle');

  return {
    variant,
    ritual,
    setVariant,
    setRitual,
  };
}
