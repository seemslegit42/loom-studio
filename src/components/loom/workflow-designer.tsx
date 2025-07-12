
'use client';

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ChevronDown, Terminal, PlayCircle, Cpu, Waypoints, Info } from "lucide-react";
import { useState } from "react";
import { WorkflowNodePalette } from "./workflow-node-palette";
import { WorkflowNode } from "./workflow-node";
import { SigilRites } from "../sigil-rites/SigilRites";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AgentTaskConfig } from "./agent-task-config";

/**
 * The centerpiece of Loom Studio, providing the Agent Orchestration Canvas
 * and its surrounding UI panels for building agentic workflows.
 */
export default function WorkflowDesigner() {
    const [isConsoleOpen, setIsConsoleOpen] = useState(true);
    const [selectedNode, setSelectedNode] = useState<string | null>(null);

    const nodes = [
        { id: 'start', title: 'Start Node', icon: PlayCircle },
        { id: 'agent-task', title: 'Agent Task', icon: Cpu },
        { id: 'end', title: 'End Node', icon: Waypoints },
    ];
    
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
                                <WorkflowNode 
                                    icon={PlayCircle} 
                                    title="Start Node"
                                    isSelected={selectedNode === 'Start Node'}
                                    onClick={() => setSelectedNode('Start Node')}
                                />
                                
                                <div className="absolute left-[calc(100%_-_2px)] top-1/2 -translate-y-1/2 w-16 h-px bg-transparent">
                                    <svg width="64" height="2" viewBox="0 0 64 2" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-0 top-1/2 -translate-y-1/2 stroke-border/80">
                                        <path d="M0 1H64" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
                                    </svg>
                                    <svg width="10" height="12" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-0 top-1/2 -translate-y-1/2 stroke-border/80">
                                        <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>

                                <WorkflowNode 
                                    icon={Cpu} 
                                    title="Agent Task"
                                    isSelected={selectedNode === 'Agent Task'}
                                    onClick={() => setSelectedNode('Agent Task')}
                                />

                                <div className="absolute left-[calc(200%_+_62px)] top-1/2 -translate-y-1/2 w-16 h-px bg-transparent">
                                     <svg width="64" height="2" viewBox="0 0 64 2" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-0 top-1/2 -translate-y-1/2 stroke-border/80">
                                        <path d="M0 1H64" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
                                    </svg>
                                    <svg width="10" height="12" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-0 top-1/2 -translate-y-1/2 stroke-border/80">
                                        <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>

                                <WorkflowNode 
                                    icon={Waypoints} 
                                    title="End Node"
                                    isSelected={selectedNode === 'End Node'}
                                    onClick={() => setSelectedNode('End Node')}
                                />
                            </div>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle className={cn(!isConsoleOpen && "hidden")}/>
                    <ResizablePanel defaultSize={25} minSize={5} collapsible={true} collapsedSize={0} onCollapse={() => setIsConsoleOpen(false)} onExpand={() => setIsConsoleOpen(true)} className={cn("bg-card/40 backdrop-blur-sm")}>
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
            <aside className="h-full bg-card/30 border-l border-border/50 p-4 flex flex-col gap-4">
                <h2 className="text-lg font-headline text-muted-foreground">
                    {selectedNode ? `Inspector: ${selectedNode}` : 'Inspector'}
                </h2>
                <div className="flex-1">
                    {!selectedNode ? (
                         <div className="h-full flex items-center justify-center">
                            <Alert className="border-border/40">
                                <Info className="h-4 w-4" />
                                <AlertTitle>Nothing Selected</AlertTitle>
                                <AlertDescription>
                                    Select a node on the canvas to configure its properties.
                                </AlertDescription>
                            </Alert>
                        </div>
                    ) : (
                        <div>
                            {selectedNode === 'Agent Task' ? (
                                <AgentTaskConfig />
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Configuration for <span className="text-accent">{selectedNode}</span> will appear here.
                               </p>
                            )}
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
}
