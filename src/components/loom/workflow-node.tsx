import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface WorkflowNodeProps {
    icon: LucideIcon;
    title: string;
    children?: React.ReactNode;
    className?: string;
}

/**
 * A component representing a single, configured node on the workflow canvas.
 * It displays the node's core identity and provides connection points.
 * @param {WorkflowNodeProps} props - The props for the component.
 * @returns {JSX.Element} The rendered workflow node.
 */
export function WorkflowNode({ icon: Icon, title, children, className }: WorkflowNodeProps) {
    return (
        <div className={cn(
            "relative flex flex-col items-center justify-center w-48 h-24 p-4 rounded-lg border-2 border-border/60 bg-card/60 backdrop-blur-sm shadow-lg",
            "transition-all duration-200 hover:border-primary/80 hover:shadow-primary/20 hover:shadow-2xl",
            className
        )}>
            {/* Input Handle */}
            <div className="absolute -left-[9px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border-2 border-primary/50" />

            <div className="flex items-center gap-3">
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-foreground text-center">{title}</h3>
            </div>
            {children && <div className="mt-2 text-xs text-muted-foreground">{children}</div>}

            {/* Output Handle */}
            <div className="absolute -right-[9px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border-2 border-primary/50" />
        </div>
    );
}
