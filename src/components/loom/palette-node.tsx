import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface PaletteNodeProps {
    icon: LucideIcon;
    title: string;
    description: string;
    className?: string;
}

/**
 * A reusable component for displaying a single draggable node in the Palette.
 * It provides a consistent visual representation for all workflow nodes.
 * @param {PaletteNodeProps} props - The props for the component.
 * @returns {JSX.Element} The rendered palette node.
 */
export function PaletteNode({ icon: Icon, title, description, className }: PaletteNodeProps) {
    return (
        <div className={cn(
            "flex items-center gap-4 p-3 rounded-lg border border-border/50 bg-card/40 cursor-grab",
            "hover:bg-primary/10 hover:border-primary/50 hover:glow-primary transition-all duration-200",
            className
        )}>
            <div className="p-2 rounded-md bg-background border border-border/60">
                <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
                <h4 className="font-semibold text-foreground">{title}</h4>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}
