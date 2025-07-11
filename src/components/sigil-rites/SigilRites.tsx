
'use client';
import { useEffect } from "react";
import clsx from "clsx";
import './sigil-rites.css';

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
 * @interface ISigilRitesProps
 * @description Props for the SigilRites component.
 * @extends React.HTMLAttributes<HTMLDivElement>
 * @property {Variant} variant - The visual variant of the sigil.
 * @property {Ritual} ritual - The current animation ritual to perform.
 * @property {() => void} [onRitualComplete] - Callback fired when a ritual animation completes.
 * @property {boolean} [sonicSignature] - If true, logs that sound should be played.
 */
interface ISigilRitesProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: Variant;
  ritual: Ritual;
  onRitualComplete?: () => void;
  sonicSignature?: boolean;
}

/**
 * Renders a complex, animated SVG sigil that represents the core orchestration engine.
 * The sigil's appearance and animation are controlled by `variant` and `ritual` props,
 * allowing it to visually represent different system states (e.g., idle, processing).
 * @param {ISigilRitesProps} props - The props for the component.
 * @returns {JSX.Element} The rendered sigil component.
 */
export function SigilRites({
  variant = 'aegis',
  ritual = 'idle',
  onRitualComplete,
  sonicSignature = false,
  ...props
}: ISigilRitesProps) {
  useEffect(() => {
    if (ritual === 'idle') return;

    console.log(`Ritual started: ${ritual}`);
    if (sonicSignature) {
      console.log(`⚡️ Sonic Signature Activated: ${variant} + ${ritual}`);
      // Placeholder: Integrate Web Audio API soundscapes here
    }
    
    const sigilCore = document.querySelector('.sigil-core');
    const handleAnimationEnd = (event: AnimationEvent) => {
      // Ensure we only trigger completion on the intended animation
      if (event.animationName === 'summon-glow') {
        onRitualComplete?.();
        console.log(`Ritual completed: ${ritual}`);
      }
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
