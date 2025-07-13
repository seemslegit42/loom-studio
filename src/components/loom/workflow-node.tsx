import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import Image from 'next/image';

interface WorkflowNodeProps {
    icon: LucideIcon;
    title: string;
    children?: React.ReactNode;
    className?: string;
    isSelected?: boolean;
    onClick?: () => void;
    content?: string | null;
}

/**
 * A component representing a single, configured node on the workflow canvas.
 * It displays the node's core identity and provides connection points.
 * @param {WorkflowNodeProps} props - The props for the component.
 * @returns {JSX.Element} The rendered workflow node.
 */
export function WorkflowNode({ icon: Icon, title, children, className, isSelected, onClick, content }: WorkflowNodeProps) {
    const isAvatar = !!content;

    return (
        <div 
            className={cn(
                "relative flex flex-col items-center justify-center w-40 h-32 p-4 rounded-lg border-2 bg-card/80 backdrop-blur-sm shadow-lg cursor-pointer",
                "transition-all duration-200",
                isSelected 
                    ? "border-primary/80 shadow-primary/20 shadow-2xl" 
                    : "border-border/60 hover:border-primary/60 hover:shadow-primary/10",
                className
            )}
            onClick={onClick}
        >
            {/* Input Handle */}
            <div className="absolute -left-[9px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border-2 border-primary/50" />

            <div className="flex flex-col items-center justify-center gap-2 text-center">
                 {isAvatar ? (
                     <Image 
                        src={content} 
                        alt={`${title} Avatar`} 
                        width={48} 
                        height={48}
                        data-ai-hint="avatar"
                        className="rounded-full object-cover border-2 border-primary/50"
                    />
                ) : (
                    <Icon className="h-8 w-8 text-primary" />
                )}
                <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">{title}</h3>
            </div>
            
            {children && <div className="mt-2 text-xs text-muted-foreground">{children}</div>}

            {/* Output Handle */}
            <div className="absolute -right-[9px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border-2 border-primary/50" />
        </div>
    );
}
