
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import Image from 'next/image';
import { useInteractiveNode } from "@/hooks/use-interactive-node";
import { motion } from "framer-motion";

interface WorkflowNodeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
    nodeId: string;
    icon: LucideIcon;
    title: string;
    isSelected?: boolean;
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onDragEnd: (nodeId: string, position: { x: number, y: number }) => void;
    avatarDataUri?: string | null;
    dataAiHint?: string;
    initialPosition: { x: number, y: number };
}

/**
 * A component representing a single, configured node on the workflow canvas.
 * It displays the node's core identity and provides connection points.
 * @param {WorkflowNodeProps} props - The props for the component.
 * @returns {JSX.Element} The rendered workflow node.
 */
export function WorkflowNode({ 
    nodeId, 
    icon: Icon, 
    title, 
    className, 
    isSelected, 
    onClick, 
    avatarDataUri,
    dataAiHint,
    initialPosition,
    onDragEnd,
    ...props 
}: WorkflowNodeProps) {
    const isAvatar = !!avatarDataUri;

    const { position, isDragging, handleMouseDown } = useInteractiveNode({
        nodeId,
        initialPosition,
        onDragEnd,
    });

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (onClick) {
            onClick(e);
        }
    };
    
    return (
        <motion.div 
            className={cn(
                "absolute flex flex-col items-center justify-center w-40 h-32 p-4 rounded-lg border-2 bg-card/80 backdrop-blur-sm shadow-lg",
                isDragging ? "cursor-grabbing z-20" : "cursor-pointer z-10",
                "transition-shadow duration-200",
                isSelected 
                    ? "border-primary/80 shadow-primary/20 shadow-2xl" 
                    : "border-border/60 hover:border-primary/60 hover:shadow-primary/10",
                className
            )}
            style={{
                left: `${position.x}%`, 
                top: `${position.y}%`,
            }}
            initial={{ scale: 0.5, opacity: 0, x: "-50%", y: "-50%" }}
            animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%" }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            {...props}
        >
            {/* Input Handle */}
            <div className="absolute -left-[9px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border-2 border-primary/50" />

            <div className="flex flex-col items-center justify-center gap-2 text-center">
                 {isAvatar ? (
                     <Image 
                        src={avatarDataUri} 
                        alt={`${title} Avatar`} 
                        width={48} 
                        height={48}
                        data-ai-hint={dataAiHint}
                        className="rounded-full object-cover border-2 border-primary/50 pointer-events-none"
                    />
                ) : (
                    <Icon className="h-8 w-8 text-primary pointer-events-none" />
                )}
                <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2 pointer-events-none">{title}</h3>
            </div>
            
            {/* Output Handle */}
            <div className="absolute -right-[9px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border-2 border-primary/50" />
        </motion.div>
    );
}
