
'use client';

import { cn } from "@/lib/utils";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { WorkflowNodePalette } from "./workflow-node-palette";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AgentProfileChart } from "./agent-profile-chart";
import { SigilRites, type Ritual } from "../sigil-rites/SigilRites";
import { WorkflowCanvas } from "./workflow-canvas";
import type { WorkflowNodeData } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import { AgentTaskConfig } from "./agent-task-config";

interface SplitLayoutProps {
  ritual: Ritual;
  setRitual: (ritual: Ritual) => void;
  isPaletteOpen: boolean;
  setIsPaletteOpen: (isOpen: boolean) => void;
  isInspectorOpen: boolean;
  setIsInspectorOpen: (isOpen: boolean) => void;
  nodes: WorkflowNodeData[];
  setNodes: React.Dispatch<React.SetStateAction<WorkflowNodeData[]>>;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
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
  selectedNodeId,
  setSelectedNodeId,
}: SplitLayoutProps) {
  
  const selectedNode = nodes.find(node => node.id === selectedNodeId) || null;
  
  const handleNodeDragEnd = (nodeId: string, newPosition: { x: number; y: number }) => {
    setNodes(currentNodes => 
        currentNodes.map(node => 
            node.id === nodeId ? { ...node, position: newPosition } : node
        )
    );
  };
  
  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setIsInspectorOpen(true);
  }

  const PalettePanel = () => (
    <div className="p-4 h-full flex flex-col">
      <h2 className="text-lg font-headline text-muted-foreground pb-4">Palette</h2>
      <WorkflowNodePalette />
    </div>
  );

  const InspectorPanel = () => (
    <div className="p-4 h-full flex flex-col">
       <h2 className="text-lg font-headline text-muted-foreground">Inspector</h2>
        <ScrollArea className="flex-1 mt-4 -mr-4 pr-4">
          <div className="space-y-6">
            {selectedNode ? (
              <>
                <AgentProfileChart profile={selectedNode.profile} agentName={selectedNode.name} />
                <AgentTaskConfig
                  initialPrompt={selectedNode.prompt}
                  agentId={selectedNode.id}
                  // Add other props for editing agent later
                />
              </>
            ) : (
              <Card className="border-border/60 bg-card/40">
                  <CardHeader>
                      <CardTitle>Inspector</CardTitle>
                      <CardDescription>Select an agent on the canvas to view its personality matrix and configuration.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="text-sm text-muted-foreground text-center italic py-8">
                          No agent selected.
                      </div>
                  </CardContent>
              </Card>
            )}
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

      <ResizablePanelGroup direction="horizontal" className="h-full w-full hidden md:flex">
        {/* Palette Panel (Desktop) */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="h-full bg-card/30 border-r border-border/50 flex-col gap-4 hidden md:flex">
          <PalettePanel />
        </ResizablePanel>
        <ResizableHandle withHandle className="hidden md:flex" />

        <ResizablePanel defaultSize={60}>
            <WorkflowCanvas 
              nodes={nodes}
              selectedNodeId={selectedNodeId}
              onNodeClick={handleNodeClick}
              onNodeDragEnd={handleNodeDragEnd}
            />
        </ResizablePanel>

        <ResizableHandle withHandle className="hidden md:flex" />
        {/* Inspector Panel (Desktop) */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="h-full bg-card/30 border-l border-border/50 flex-col gap-4 hidden md:flex">
          <InspectorPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
      
      {/* Mobile-Only Canvas View */}
       <div className="h-full w-full md:hidden">
         <WorkflowCanvas 
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onNodeClick={handleNodeClick}
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
