import { Cpu, PlayCircle, Waypoints, Zap } from "lucide-react";
import { PaletteNode } from "./palette-node";
import { ScrollArea } from "../ui/scroll-area";


/**
 * The Palette panel component, which displays a list of all available
 * workflow nodes that can be dragged onto the canvas.
 * @returns {JSX.Element} The rendered palette component.
 */
export function WorkflowNodePalette() {
    return (
        <ScrollArea className="h-full">
            <div className="flex flex-col gap-3 pr-4">
                <PaletteNode 
                    icon={PlayCircle} 
                    title="Start Node" 
                    description="The initiation point of a workflow." 
                />
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
                 <PaletteNode 
                    icon={Waypoints} 
                    title="End Node" 
                    description="The termination point of a workflow." 
                />
            </div>
        </ScrollArea>
    );
}
