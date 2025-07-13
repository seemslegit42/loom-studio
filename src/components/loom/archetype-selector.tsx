
'use client';
import { workflowNodeCodex, type CodexNode } from "@/lib/codex";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface ArchetypeSelectorProps {
    onSelect: (archetype: CodexNode) => void;
}

const archetypes = workflowNodeCodex.filter(node => node.family === 'Archetype');

export function ArchetypeSelector({ onSelect }: ArchetypeSelectorProps) {
    return (
        <TooltipProvider delayDuration={200}>
            <div className="p-2">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2 px-1">Select an Archetype</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {archetypes.map(archetype => (
                        <Tooltip key={archetype.name}>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => onSelect(archetype)}
                                    className="flex flex-col items-center justify-center p-3 rounded-md text-center h-24 w-full
                                               border border-transparent bg-transparent hover:bg-primary/10 hover:border-primary/30 
                                               transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <archetype.icon className="h-8 w-8 text-primary/80 mb-2" />
                                    <span className="font-semibold text-sm">{archetype.name}</span>
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-xs">
                                <p className="font-bold">{archetype.subtitle}</p>
                                <p className="text-muted-foreground">{archetype.tooltip}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
            </div>
        </TooltipProvider>
    );
}
