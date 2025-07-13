
'use client';

import { PersonaCard } from "./persona-card";
import { personas } from "@/lib/personas";

interface PersonaGalleryProps {
    onSelectPersona: (prompt: string) => void;
}

/**
 * A component that displays a gallery of pre-defined agent personas.
 * Allows the user to select a persona to pre-fill the agent creation form.
 * @returns {JSX.Element} The rendered persona gallery component.
 */
export function PersonaGallery({ onSelectPersona }: PersonaGalleryProps) {
    return (
        <div className="space-y-3">
             <p className="text-sm text-muted-foreground px-1">Or, begin with a pre-defined Persona...</p>
            <div className="grid grid-cols-2 gap-2">
                {personas.map((persona) => (
                    <PersonaCard 
                        key={persona.name}
                        persona={persona}
                        onSelect={() => onSelectPersona(persona.prompt)}
                    />
                ))}
            </div>
        </div>
    );
}
