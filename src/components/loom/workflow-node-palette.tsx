import { Cpu, PlayCircle, Waypoints, GitBranch, Webhook, Sparkles, BotMessageSquare, CheckCircle } from "lucide-react";
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
                    title="The Spark: Start a New Task" 
                    description="Kicks off an automation when you press 'run' or at a scheduled time." 
                />
                 <PaletteNode 
                    icon={Webhook} 
                    title="The Signal: Start When Another App Acts" 
                    description="Listens for an action in another tool (like a new sale in Shopify or a new row in Google Sheets) and starts this workflow automatically." 
                />
                <PaletteNode 
                    icon={GitBranch} 
                    title="The Crossroads: Create a Simple 'If/Then'" 
                    description="Creates a fork in the road. If a condition is met (e.g., 'Is the customer a VIP?'), go down one path. If not, go down the other." 
                />
                 <PaletteNode 
                    icon={Cpu} 
                    title="The Agent: Give an AI a Job" 
                    description="Assign a specific task to your AI assistant, like summarizing text, writing an email, or sorting data into categories." 
                />
                 <PaletteNode 
                    icon={Waypoints} 
                    title="The Bridge: Connect to an Outside Tool" 
                    description="Pull information from or send commands to another application, like pulling customer data from your CRM or adding an event to your calendar." 
                />
                 <PaletteNode 
                    icon={Sparkles} 
                    title="The Refiner: Clean Up & Format Data" 
                    description="Instantly cleans up messy data. Use it to format names, fix dates, or combine fields (like turning 'John' and 'Smith' into 'John Smith')." 
                />
                 <PaletteNode 
                    icon={BotMessageSquare} 
                    title="The Oracle: Ask the AI a Question" 
                    description="For when you need a direct answer or idea from the core AI. Just type your question and get a response." 
                />
                <PaletteNode 
                    icon={CheckCircle} 
                    title="The Seal: Finish the Task" 
                    description="Marks the end of the automation. The work is done." 
                />
            </div>
        </ScrollArea>
    );
}
