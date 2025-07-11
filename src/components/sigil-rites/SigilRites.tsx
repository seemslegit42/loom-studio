'use client';
import { useEffect } from "react";
import clsx from "clsx";
import './sigil-rites.css';

export type Variant = 'aegis' | 'klepsydra' | 'genesis';
export type Ritual = 'summon' | 'orchestrate' | 'transmute' | 'idle';

interface ISigilRitesProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: Variant;
  ritual: Ritual;
  onRitualComplete?: () => void;
  sonicSignature?: boolean;
}

export function SigilRites({
  variant = 'aegis',
  ritual = 'idle',
  onRitualComplete,
  sonicSignature = false,
  ...props
}: ISigilRitesProps) {
  useEffect(() => {
    // Ritual lifecycle hooks (stubbed)
    console.log(`Ritual started: ${ritual}`);
    if (sonicSignature) {
      console.log(`⚡️ Sonic Signature Activated: ${variant} + ${ritual}`);
      // Placeholder: Integrate Web Audio API soundscapes here
    }
    
    const sigilCore = document.querySelector('.sigil-core');
    const handleAnimationEnd = () => {
      onRitualComplete?.();
      console.log(`Ritual completed: ${ritual}`);
    };

    sigilCore?.addEventListener('animationend', handleAnimationEnd);
    
    return () => {
      sigilCore?.removeEventListener('animationend', handleAnimationEnd);
    };
  }, [ritual, onRitualComplete, sonicSignature, variant]);

  return (
    <div
      {...props}
      className={clsx("sigil-rites-container")}
    >
      <div className={clsx("sigil-rites", `variant-${variant}`, `ritual-${ritual}`)}>
        {/* Core Sigil */}
        <svg className="sigil-core" viewBox="0 0 200 200">
            {/* Base Circle */}
            <circle className="base-ring" cx="100" cy="100" r="90" />
            
            {/* Spinning Arcs */}
            <circle className="arc-1" cx="100" cy="100" r="75" />
            <circle className="arc-2" cx="100" cy="100" r="75" />
            
            {/* Pulsing Core */}
            <circle className="core-pulse" cx="100" cy="100" r="30" />
            
            {/* Agent Glyphs (placeholder squares) */}
            <g className="agent-glyphs">
                <rect x="92.5" y="20" width="15" height="15" />
                <rect x="159.1" y="49.4" width="15" height="15" />
                <rect x="159.1" y="135.6" width="15" height="15" />
                <rect x="92.5" y="165" width="15" height="15" />
                <rect x="25.9" y="135.6" width="15" height="15" />
                <rect x="25.9" y="49.4" width="15" height="15" />
            </g>
        </svg>
      </div>
    </div>
  );
}
