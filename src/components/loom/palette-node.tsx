import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface PaletteNodeProps {
    icon: LucideIcon;
    name: string;
    subtitle: string;
    description: string;
    devLabel?: string;
    className?: string;
}

/**
 * A reusable component for displaying a single draggable node in the Palette.
 * It provides a consistent visual representation for all workflow nodes.
 * @param {PaletteNodeProps} props - The props for the component.
 * @returns {JSX.Element} The rendered palette node.
 */
export function PaletteNode({ icon: Icon, name, subtitle, description, devLabel, className }: PaletteNodeProps) {
    return (
        <TooltipProvider delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={cn(
                        "relative flex items-center gap-4 p-3 rounded-lg border border-border/50 bg-card/40 cursor-grab",
                        "hover:bg-primary/10 hover:border-primary/50 hover:glow-primary transition-all duration-200",
                        className
                    )}>
                        <div className="p-2 rounded-md bg-background border border-border/60">
                            <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{name}</h4>
                            <p className="text-xs text-muted-foreground">{subtitle}</p>
                        </div>
                        {devLabel && (
                            <Badge variant="outline" className="absolute top-1 right-1 text-xs px-1.5 py-0.5 border-amber-400/30 text-amber-400/80">
                                {devLabel}
                            </Badge>
                        )}
                    </div>
                </TooltipTrigger>
                <TooltipContent side="right" align="start" className="max-w-xs">
                    <p>{description}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
