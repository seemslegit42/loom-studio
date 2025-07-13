
'use client';

import { cn } from "@/lib/utils";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useState } from "react";
import { WorkflowNodePalette } from "./workflow-node-palette";
import { AgentTaskConfig } from "./agent-task-config";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { AgentProfileChart } from "./agent-profile-chart";
import { forgeAgentIdentity } from "@/ai/flows/forge-agent-identity-flow";
import { SigilRites, type Ritual, type Variant } from "../sigil-rites/SigilRites";
import { Skeleton } from "../ui/skeleton";
import BottomBar from "./bottom-bar";
import { WorkflowCanvas } from "./workflow-canvas";
import type { WorkflowNodeData } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";


interface SplitLayoutProps {
  variant: Variant;
  ritual: Ritual;
  setRitual: (ritual: Ritual) => void;
}

/**
 * The main three-panel layout for Loom Studio, featuring the Palette,
 * the central Canvas/Sigil, and the Inspector.
 * It is responsive, resizable, and manages the mobile sheet views.
 */
export default function SplitLayout({ variant, ritual, setRitual }: SplitLayoutProps) {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  const [isConfiguringAgent, setIsConfiguringAgent] = useState(false);
  
  const [nodes, setNodes] = useState<WorkflowNodeData[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedNode = nodes.find(node => node.id === selectedNodeId) || null;
  
  const { toast } = useToast();

  const handleNodeDragEnd = (nodeId: string, newPosition: { x: number; y: number }) => {
    setNodes(currentNodes => 
        currentNodes.map(node => 
            node.id === nodeId ? { ...node, position: newPosition } : node
        )
    );
  };

  const handleConfigureAgent = async (prompt: string) => {
    setIsConfiguringAgent(true);
    setRitual('orchestrate');
    setSelectedNodeId(null);

    try {
      const result = await forgeAgentIdentity({ prompt });
      
      const newNode: WorkflowNodeData = {
        id: `agent_${Date.now()}`,
        name: result.name,
        avatarDataUri: result.avatarDataUri,
        profile: result.profile,
        position: {
          x: 50 + (Math.random() * 10 - 5),
          y: 50 + (Math.random() * 10 - 5),
        },
      };

      setNodes(prevNodes => [...prevNodes, newNode]);
      setSelectedNodeId(newNode.id);
      
      toast({
        title: "Agent Forged",
        description: `New agent "${result.name}" has been summoned to the canvas.`,
      });

    } catch (error) {
      console.error("Agent configuration failed:", error);
      toast({
        variant: "destructive",
        title: "Error Forging Agent",
        description: "The agent's identity could not be forged. Please try again.",
      });
    } finally {
      setIsConfiguringAgent(false);
      setRitual('idle');
    }
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
        <div className="flex-1 mt-4 space-y-6 overflow-y-auto pr-2">
          
          {!selectedNodeId && (
            <AgentTaskConfig onConfigure={handleConfigureAgent} isConfiguring={isConfiguringAgent} />
          )}

          {isConfiguringAgent && !selectedNode ? (
             <Card className="border-border/60 bg-card/40">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-48 w-full" />
                </CardContent>
             </Card>
          ) : selectedNode && selectedNode.profile ? (
              <AgentProfileChart profile={selectedNode.profile} agentName={selectedNode.name} />
          ) : null}
        </div>
    </div>
  );

  return (
    <>
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
              setSelectedNodeId={setSelectedNodeId}
              onNodeDragEnd={handleNodeDragEnd}
            >
                <SigilRites variant={variant} ritual={ritual} onRitualComplete={() => setRitual('idle')} />
            </WorkflowCanvas>
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
            setSelectedNodeId={setSelectedNodeId}
            onNodeDragEnd={handleNodeDragEnd}
          >
              <SigilRites variant={variant} ritual={ritual} onRitualComplete={() => setRitual('idle')} />
          </WorkflowCanvas>
      </div>


      {/* Mobile Bottom Bar controlled Sheets */}
      <BottomBar onTogglePalette={() => setIsPaletteOpen(p => !p)} onToggleInspector={() => setIsInspectorOpen(p => !p)} />

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
