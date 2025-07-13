
'use client';

import Header from "@/components/loom/header";
import SplitLayout from "@/components/loom/split-layout";
import BottomBar from "@/components/loom/bottom-bar";
import { useSystemSigilState } from "@/hooks/use-system-sigil-state";
import { useState } from "react";
import type { WorkflowNodeData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { forgeAgentIdentity } from "@/ai/flows/forge-agent-identity-flow";

const initialNodes: WorkflowNodeData[] = [
  {
    id: 'welcome_agent_1',
    name: 'Welcome Agent',
    avatarDataUri: `https://placehold.co/96x96.png`,
    dataAiHint: 'welcome robot',
    profile: [
      { trait: 'Creativity', value: 75 },
      { trait: 'Humor', value: 40 },
      { trait: 'Formality', value: 85 },
      { trait: 'Enthusiasm', value: 60 },
      { trait: 'Technicality', value: 90 },
      { trait: 'Whimsy', value: 20 },
    ],
    position: { x: 50, y: 50 },
  }
];


/**
 * The main page component for Loom Studio, serving as the root of the application's UI.
 * It orchestrates the header, the main split-view layout, and the mobile-only bottom bar.
 *
 * @returns {JSX.Element} The rendered home page.
 */
export default function Home() {
  const { variant, ritual, setRitual } = useSystemSigilState();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isConfiguringAgent, setIsConfiguringAgent] = useState(false);
  
  const [nodes, setNodes] = useState<WorkflowNodeData[]>(initialNodes);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(initialNodes[0]?.id || null);

  const { toast } = useToast();

  const handleForgeAgent = async (promptToForge: string) => {
    if (!promptToForge.trim()) return;

    setIsConfiguringAgent(true);
    setRitual('summon'); // Start the grand ritual
    setSelectedNodeId(null);
    setIsInspectorOpen(false);

    try {
      const result = await forgeAgentIdentity({ prompt: promptToForge });
      
      const newNode: WorkflowNodeData = {
        id: `agent_${Date.now()}`,
        name: result.name,
        avatarDataUri: result.avatarDataUri,
        dataAiHint: "futuristic agent", // Placeholder hint
        profile: result.profile,
        position: {
          x: 45 + (Math.random() * 10),
          y: 45 + (Math.random() * 10),
        },
      };

      setNodes(prevNodes => [...prevNodes, newNode]);
      setSelectedNodeId(newNode.id);
      setIsInspectorOpen(true);
      
      toast({
        title: "Agent Forged",
        description: `The new agent, "${result.name}", has been summoned to the canvas.`,
      });

    } catch (error) {
      console.error("Agent configuration failed:", error);
      toast({
        variant: "destructive",
        title: "Aetheric Interference",
        description: "The agent's identity could not be forged. Please check the incantation or try again.",
      });
    } finally {
      setIsConfiguringAgent(false);
      setRitual('idle'); // End the ritual
    }
  }


  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header onForge={handleForgeAgent} isForging={isConfiguringAgent} />
      <main className="flex-1 overflow-hidden">
        <SplitLayout
          ritual={ritual}
          setRitual={setRitual}
          isPaletteOpen={isPaletteOpen}
          setIsPaletteOpen={setIsPaletteOpen}
          isInspectorOpen={isInspectorOpen}
          setIsInspectorOpen={setIsInspectorOpen}
          nodes={nodes}
          setNodes={setNodes}
          selectedNodeId={selectedNodeId}
          setSelectedNodeId={setSelectedNodeId}
          isConfiguringAgent={isConfiguringAgent}
        />
      </main>
      <BottomBar
        onTogglePalette={() => setIsPaletteOpen(p => !p)}
        onToggleInspector={() => setIsInspectorOpen(p => !p)}
      />
    </div>
  );
}
