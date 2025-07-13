import { Cpu, PlayCircle, Waypoints, Zap, Split, Webhook, Combine, MessageSquarePlus } from "lucide-react";
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
                        title="Start Node" 
                        description="The initiation point of a workflow." 
                    />
                    <PaletteNode 
                        icon={Waypoints} 
                        title="End Node" 
                        description="The termination point of a workflow." 
                    />
                    <PaletteNode 
                        icon={Split} 
                        title="Condition" 
                        description="Branch logic based on data evaluation." 
                    />
                    <PaletteNode 
                        icon={Webhook} 
                        title="Trigger" 
                        description="Initiate workflow from an external event." 
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
                        title="API Call" 
                        description="Interact with an external API." 
                    />
                </PaletteSection>

                <PaletteSection title="Data & Prompts">
                    <PaletteNode 
                        icon={Combine} 
                        title="Data Transform" 
                        description="Manipulate data within the workflow." 
                    />
                    <PaletteNode 
                        icon={MessageSquarePlus} 
                        title="Prompt" 
                        description="Directly inject or modify LLM prompts." 
                    />
                </PaletteSection>
            </div>
        </ScrollArea>
    );
}
