
'use client';
import { useState } from 'react';

export type Variant = 'aegis' | 'klepsydra' | 'genesis';
export type Ritual = 'summon' | 'orchestrate' | 'transmute' | 'idle';

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

    