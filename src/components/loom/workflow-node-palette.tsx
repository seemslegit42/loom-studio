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
                        description="The front door to your workflow; where the process begins with its initial data." 
                    />
                    <PaletteNode 
                        icon={Waypoints} 
                        title="Workflow Output" 
                        description="The final result or conclusion of a process. What the workflow will produce." 
                    />
                    <PaletteNode 
                        icon={GitBranch} 
                        title="Decision Point" 
                        description="Create an 'if/then' rule. If a customer is 'VIP', send them down a different path." 
                    />
                    <PaletteNode 
                        icon={Webhook} 
                        title="Webhook" 
                        description="Starts this workflow when another app sends a signal (e.g. a new sale in Shopify)." 
                    />
                </PaletteSection>

                <PaletteSection title="Agent & Actions">
                    <PaletteNode 
                        icon={Cpu} 
                        title="Agent Task" 
                        description="Delegate a complex task to a specialized AI agent you have created." 
                    />
                    <PaletteNode 
                        icon={Zap} 
                        title="External System" 
                        description="Get or send data to another tool, like Google Sheets, Stripe, or a weather app." 
                    />
                </PaletteSection>

                <PaletteSection title="Data & Prompts">
                    <PaletteNode 
                        icon={Sparkles} 
                        title="Data Alchemy" 
                        description="Clean up, format, or combine data. Turn a messy address into a clean one." 
                    />
                    <PaletteNode 
                        icon={BotMessageSquare} 
                        title="Prompt" 
                        description="Craft a specific instruction or question for a generic AI model from OpenAI or Google." 
                    />
                </PaletteSection>
            </div>
        </ScrollArea>
    );
}
