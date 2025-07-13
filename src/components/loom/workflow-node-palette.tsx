import { Cpu, PlayCircle, Waypoints, Zap, Split, Webhook, Combine, MessageSquarePlus, GitBranch, Terminal, BotMessageSquare, Sparkles } from "lucide-react";
import { PaletteNode } from "./palette-node";
import { ScrollArea } from "../ui/scroll-area";


/**
 * The Palette panel component, which displays a list of all available
 * workflow nodes that can be dragged onto the canvas.
 * @returns {JSX.Element} The rendered palette component.
 */
export function WorkflowNodePalette() {

    const PaletteSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <div className="space-y-3">
            <h3 className="px-3 text-xs font-semibold uppercase text-muted-foreground tracking-wider">{title}</h3>
            {children}
        </div>
    );

    return (
        <ScrollArea className="h-full">
            <div className="flex flex-col gap-6 pr-4">
                <PaletteSection title="Flow Control">
                    <PaletteNode 
                        icon={PlayCircle} 
                        title="Workflow Input" 
                        description="Defines the starting data or event for a new process." 
                    />
                    <PaletteNode 
                        icon={Waypoints} 
                        title="Workflow Output" 
                        description="Defines the final result or conclusion of a process." 
                    />
                    <PaletteNode 
                        icon={GitBranch} 
                        title="Decision Point" 
                        description="Create a rule to branch the workflow down different paths." 
                    />
                    <PaletteNode 
                        icon={Webhook} 
                        title="Event Listener" 
                        description="Listens for an external signal to start a workflow." 
                    />
                </PaletteSection>

                <PaletteSection title="Agent & Actions">
                    <PaletteNode 
                        icon={Cpu} 
                        title="Agent Task" 
                        description="Delegate a task to a specialized AI agent." 
                    />
                    <PaletteNode 
                        icon={Zap} 
                        title="External System" 
                        description="Connect to and exchange data with an outside tool or service." 
                    />
                </PaletteSection>

                <PaletteSection title="Data & Prompts">
                    <PaletteNode 
                        icon={Sparkles} 
                        title="Data Alchemy" 
                        description="Modify, combine, or reshape data within the workflow." 
                    />
                    <PaletteNode 
                        icon={BotMessageSquare} 
                        title="Prompt" 
                        description="Craft a specific instruction or question for an AI model." 
                    />
                </PaletteSection>
            </div>
        </ScrollArea>
    );
}
