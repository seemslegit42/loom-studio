
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PersonaCard } from "./persona-card";
import { personas, type Persona } from "@/lib/personas";

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
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger className="text-sm text-muted-foreground hover:no-underline">
                    Or begin with a pre-defined Persona...
                </AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-2 pt-2">
                        {personas.map((persona) => (
                            <PersonaCard 
                                key={persona.name}
                                persona={persona}
                                onSelect={() => onSelectPersona(persona.prompt)}
                            />
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
