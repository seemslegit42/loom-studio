
import type { Persona } from "@/lib/personas";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
                "p-3 rounded-lg border border-border/40 bg-background/30 cursor-pointer text-center",
                "hover:bg-primary/10 hover:border-primary/50 transition-colors duration-200 hover:glow-primary"
            )}
            onClick={onSelect}
        >
            <div className="flex flex-col items-center gap-2">
                <Image 
                    src={persona.avatarDataUri}
                    alt={`${persona.name} Avatar`}
                    width={48}
                    height={48}
                    className="rounded-full object-cover border-2 border-primary/30"
                />
                <h4 className="font-semibold text-sm text-foreground">{persona.name}</h4>
                <p className="text-xs text-muted-foreground italic leading-tight">"{persona.quote}"</p>
            </div>
        </div>
    );
}
