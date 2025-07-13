
import type { Persona } from "@/lib/personas";
import { cn } from "@/lib/utils";

interface PersonaCardProps {
    persona: Persona;
    onSelect: () => void;
}

/**
 * A card component to display a single agent persona in the gallery.
 * @param {PersonaCardProps} props - The props for the component.
 * @returns {JSX.Element} The rendered persona card.
 */
export function PersonaCard({ persona, onSelect }: PersonaCardProps) {
    return (
        <div 
            className={cn(
                "p-3 rounded-md border border-border/40 bg-background/30 cursor-pointer",
                "hover:bg-primary/10 hover:border-primary/50 transition-colors duration-200"
            )}
            onClick={onSelect}
        >
            <h4 className="font-semibold text-sm text-foreground">{persona.name}</h4>
            <p className="text-xs text-muted-foreground italic mt-1">"{persona.quote}"</p>
            <p className="text-xs text-muted-foreground mt-2">{persona.role}</p>
        </div>
    );
}
