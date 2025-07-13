
'use client';

import { cn } from "@/lib/utils";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { WorkflowNodePalette } from "./workflow-node-palette";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AgentProfileChart } from "./agent-profile-chart";
import { SigilRites, type Ritual } from "../sigil-rites/SigilRites";
import { WorkflowCanvas } from "./workflow-canvas";
import type { WorkflowNodeData, WorkflowConnection } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import { AgentTaskConfig } from "./agent-task-config";
import type { CodexNode } from "@/lib/codex";
import { GenesisChamber, type ForgedAgent } from "./genesis-chamber";
import { Button } from "../ui/button";
import { Sparkles } from "lucide-react";
import { useState } from "react";

interface SplitLayoutProps {
  ritual: Ritual;
  setRitual: (ritual: Ritual) => void;
  isPaletteOpen: boolean;
  setIsPaletteOpen: (isOpen: boolean) => void;
  isInspectorOpen: boolean;
  setIsInspectorOpen: (isOpen: boolean) => void;
  nodes: WorkflowNodeData[];
  setNodes: React.Dispatch<React.SetStateAction<WorkflowNodeData[]>>;
  connections: WorkflowConnection[];
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  selectedConnectionId: string | null;
  setSelectedConnectionId: (id: string | null) => void;
  onUpdateNode: (nodeId: string, newPrompt: string, newProfile?: WorkflowNodeData['profile']) => void;
  onSummonNode: (codexNode: CodexNode) => void;
  onNexusSummon: (connectionId: string) => void;
  genesisPrompt: string;
  onFinalizeForge: (agent: ForgedAgent) => void;
  onCancelForge: () => void;
}

/**
 * The main three-panel layout for Loom Studio, featuring the Palette,
 * the central Canvas/Sigil, and the Inspector.
 * It is responsive, resizable, and manages the mobile sheet views.
 */
export default function SplitLayout({ 
  ritual,
  setRitual,
  isPaletteOpen,
  setIsPaletteOpen,
  isInspectorOpen,
  setIsInspectorOpen,
  nodes,
  setNodes,
  connections,
  selectedNodeId,
  setSelectedNodeId,
  selectedConnectionId,
  setSelectedConnectionId,
  onUpdateNode,
  onSummonNode,
  onNexusSummon,
  genesisPrompt,
  onFinalizeForge,
  onCancelForge,
}: SplitLayoutProps) {
  
  const selectedNode = nodes.find(node => node.id === selectedNodeId) || null;
  const selectedConnection = connections.find(conn => conn.id === selectedConnectionId) || null;
  const [isSculpting, setIsSculpting] = useState(false);
  
  const handleNodeDragEnd = (nodeId: string, newPosition: { x: number; y: number }) => {
    setNodes(currentNodes => 
        currentNodes.map(node => 
            node.id === nodeId ? { ...node, position: newPosition } : node
        )
    );
  };
  
  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setSelectedConnectionId(null);
    setIsInspectorOpen(true);
  }

  const handleConnectionClick = (connectionId: string) => {
    setSelectedConnectionId(connectionId);
    setSelectedNodeId(null);
    setIsInspectorOpen(true); 
  }

  const handleCanvasClick = () => {
    setSelectedNodeId(null);
    setSelectedConnectionId(null);
    if (genesisPrompt) onCancelForge(); // Cancel forging if clicking on canvas
  };

  const handleProfileChange = (newProfile: WorkflowNodeData['profile']) => {
    if (!selectedNode) return;
    setIsSculpting(true); // Parent component now manages sculpting state
    onUpdateNode(selectedNode.id, selectedNode.prompt, newProfile);
  };

  const PalettePanel = () => (
    <div className="p-4 h-full flex flex-col">
      <h2 className="text-lg font-headline text-muted-foreground pb-4">Palette</h2>
      <WorkflowNodePalette onNodeSelect={onSummonNode} />
    </div>
  );

  const InspectorPanel = () => (
    <div className="p-4 h-full flex flex-col">
       <h2 className="text-lg font-headline text-muted-foreground">
        {selectedNode ? 'Inspector' : genesisPrompt ? 'Genesis Chamber' : selectedConnection ? 'Connection' : 'Inspector'}
       </h2>
        <ScrollArea className="flex-1 mt-4 -mr-4 pr-4">
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div
                  key={`inspector-node-${selectedNode.id}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <div className="space-y-6">
                    <AgentProfileChart
                        profile={selectedNode.profile}
                        agentName={selectedNode.name}
                        onProfileChange={handleProfileChange}
                        isSculpting={isSculpting}
                    />
                    <AgentTaskConfig
                      node={selectedNode}
                      onUpdateNode={onUpdateNode}
                      isSculpting={isSculpting}
                      setIsSculpting={setIsSculpting}
                    />
                  </div>
                </motion.div>
              ) : selectedConnection ? (
                 <motion.div
                    key={`inspector-conn-${selectedConnection.id}`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <Card className="border-border/60 bg-card/40">
                      <CardHeader>
                        <CardTitle>Nexus Invocation</CardTitle>
                        <CardDescription>Forge a new agent to bridge this connection.</CardDescription>
                      </CardHeader>
                      <CardContent>
                          <Button className="w-full" onClick={() => onNexusSummon(selectedConnection.id)}>
                            <Sparkles className="mr-2" />
                            Summon Nexus Agent
                          </Button>
                      </CardContent>
                  </Card>
                 </motion.div>
              ) : genesisPrompt ? (
                 <motion.div
                    key="genesis-chamber"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                   <GenesisChamber
                      prompt={genesisPrompt}
                      onFinalize={onFinalizeForge}
                      onCancel={onCancelForge}
                   />
                 </motion.div>
              ) : (
                <motion.div
                  key="inspector-placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="border-border/60 bg-card/40">
                      <CardHeader>
                          <CardTitle>Inspector</CardTitle>
                          <CardDescription>Select an agent to view its configuration, or scribe an incantation in the header to forge a new one.</CardDescription>
                      </CardHeader>
                      <CardContent>
                          <div className="text-sm text-muted-foreground text-center italic py-8">
                              The Architect's Table awaits your command.
                          </div>
                      </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
    </div>
  );

  return (
    <>
       <AnimatePresence>
        {ritual !== 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-md z-20 flex items-center justify-center"
          >
             <SigilRites variant="genesis" ritual={ritual} onRitualComplete={() => setRitual('idle')} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden md:flex h-full w-full">
        <ResizablePanelGroup direction="horizontal">
          {/* Palette Panel (Desktop) */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="h-full bg-card/30 border-r border-border/50 flex-col gap-4">
            <PalettePanel />
          </ResizablePanel>
          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={60}>
              <WorkflowCanvas 
                nodes={nodes}
                connections={connections}
                selectedNodeId={selectedNodeId}
                selectedConnectionId={selectedConnectionId}
                onNodeClick={handleNodeClick}
                onConnectionClick={handleConnectionClick}
                onCanvasClick={handleCanvasClick}
                onNodeDragEnd={handleNodeDragEnd}
              />
          </ResizablePanel>

          <ResizableHandle withHandle />
          {/* Inspector Panel (Desktop) */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="h-full bg-card/30 border-l border-border/50 flex-col gap-4">
            <InspectorPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      
      {/* Mobile-Only Canvas View */}
       <div className="h-full w-full md:hidden">
         <WorkflowCanvas 
            nodes={nodes}
            connections={connections}
            selectedNodeId={selectedNodeId}
            selectedConnectionId={selectedConnectionId}
            onNodeClick={handleNodeClick}
            onConnectionClick={handleConnectionClick}
            onCanvasClick={handleCanvasClick}
            onNodeDragEnd={handleNodeDragEnd}
          />
      </div>


      {/* Mobile Bottom Bar controlled Sheets */}

      {/* Palette Panel (Mobile) */}
      <Sheet open={isPaletteOpen} onOpenChange={setIsPaletteOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[340px] bg-card/80 backdrop-blur-lg flex flex-col">
          <PalettePanel />
        </SheetContent>
      </Sheet>

      {/* Inspector Panel (Mobile) */}
      <Sheet open={isInspectorOpen} onOpenChange={setIsInspectorOpen}>
        <SheetContent side="right" className="w-[300px] sm:w-[340px] bg-card/80 backdrop-blur-lg flex flex-col">
          <InspectorPanel />
        </SheetContent>
      </Sheet>
    </>
  );
}
