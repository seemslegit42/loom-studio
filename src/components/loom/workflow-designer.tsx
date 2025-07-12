
'use client';

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ChevronDown, Terminal, PlayCircle, Cpu, Waypoints } from "lucide-react";
import { useState } from "react";
import { WorkflowNodePalette } from "./workflow-node-palette";
import { WorkflowNode } from "./workflow-node";

/**
 * The centerpiece of Loom Studio, providing the Agent Orchestration Canvas
 * and its surrounding UI panels for building agentic workflows.
 */
export default function WorkflowDesigner() {
    const [isConsoleOpen, setIsConsoleOpen] = useState(true);
    
    return (
        <div className="h-full w-full grid grid-cols-[300px_1fr_350px] bg-background/80">
            {/* Palette Panel */}
            <aside className="h-full bg-card/30 border-r border-border/50 p-4 flex flex-col gap-4">
                <h2 className="text-lg font-headline text-muted-foreground">Palette</h2>
                <WorkflowNodePalette />
            </aside>

            {/* Main Canvas & Console Area */}
            <div className="h-full flex flex-col">
                <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={100} minSize={30}>
                        {/* The Canvas */}
                        <div className="h-full w-full flex items-center justify-center p-8 bg-background relative overflow-hidden">
                             <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
                             {/* Workflow Nodes */}
                            <div className="relative flex items-center gap-16">
                                <WorkflowNode icon={PlayCircle} title="Start Node" />
                                
                                <svg width="64" height="2" viewBox="0 0 64 2" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-[192px] stroke-border/80">
                                    <path d="M0 1H64" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
                                    <path d="M56 -6L66 1L56 8" stroke="currentColor" strokeWidth="2"/>
                                </svg>

                                <WorkflowNode icon={Cpu} title="Agent Task" />

                                <svg width="64" height="2" viewBox="0 0 64 2" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-[448px] stroke-border/80">
                                    <path d="M0 1H64" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
                                    <path d="M56 -6L66 1L56 8" stroke="currentColor" strokeWidth="2"/>
                                </svg>

                                <WorkflowNode icon={Waypoints} title="End Node" />
                            </div>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle className={cn(!isConsoleOpen && "hidden")}/>
                    <ResizablePanel defaultSize={0} minSize={5} collapsible={true} collapsedSize={0} onCollapse={() => setIsConsoleOpen(false)} onExpand={() => setIsConsoleOpen(true)} className={cn("bg-card/40 backdrop-blur-sm", !isConsoleOpen && "hidden")}>
                         {/* The Console */}
                        <div className="h-full flex flex-col">
                            <div className="flex items-center justify-between p-2 border-b border-border/50">
                                <div className="flex items-center gap-2">
                                    <Terminal className="h-5 w-5 text-muted-foreground" />
                                    <h3 className="font-mono text-sm">Console</h3>
                                </div>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsConsoleOpen(false)}>
                                    <ChevronDown className="h-5 w-5" />
                                </Button>
                            </div>
                            <div className="flex-1 p-4 text-sm font-mono text-muted-foreground/60">
                                &gt; Awaiting execution...
                            </div>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>


            {/* Inspector Panel */}
            <aside className="h-full bg-card/30 border-l border-border/50 p-4">
                <h2 className="text-lg font-headline text-muted-foreground">Inspector</h2>
                <div className="mt-4 text-sm text-center text-muted-foreground/50">
                    Select a node to configure its properties.
                </div>
            </aside>
        </div>
    );
}

