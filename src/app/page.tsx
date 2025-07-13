
'use client';

import Header from "@/components/loom/header";
import SplitLayout from "@/components/loom/split-layout";
import BottomBar from "@/components/loom/bottom-bar";
import { useSystemSigilState } from "@/hooks/use-system-sigil-state";
import { useState } from "react";
import type { WorkflowNodeData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { ForgeDialog, type ForgedAgent } from "@/components/loom/forge-dialog";

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
    prompt: "You are a helpful and welcoming agent designed to introduce users to Loom Studio."
  }
];

/**
 * The main page component for Loom Studio, serving as the root of the application's UI.
 * It orchestrates the header, the main split-view layout, and the mobile-only bottom bar.
 *
 * @returns {JSX.Element} The rendered home page.
 */
export default function Home() {
  const { ritual, setRitual } = useSystemSigilState();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  
  const [nodes, setNodes] = useState<WorkflowNodeData[]>(initialNodes);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(initialNodes[0]?.id || null);

  const [isForging, setIsForging] = useState(false);
  const [forgePrompt, setForgePrompt] = useState<string>('');

  const { toast } = useToast();

  const handleStartForge = (prompt: string) => {
    if (!prompt.trim()) return;
    setForgePrompt(prompt);
    setIsForging(true);
  };
  
  const handleFinalizeForge = (forgedAgent: ForgedAgent) => {
    if (!forgedAgent) return;
    
    setRitual('summon');

    const newNode: WorkflowNodeData = {
      id: `agent_${Date.now()}`,
      name: forgedAgent.name,
      avatarDataUri: forgedAgent.avatarDataUri || `https://placehold.co/96x96.png`,
      dataAiHint: "futuristic agent", // Placeholder hint
      profile: forgedAgent.profile,
      position: {
        x: 45 + (Math.random() * 10),
        y: 45 + (Math.random() * 10),
      },
      prompt: forgedAgent.prompt,
    };

    setNodes(prevNodes => [...prevNodes, newNode]);
    setSelectedNodeId(newNode.id);
    setIsInspectorOpen(true);
    
    toast({
      title: "Agent Forged",
      description: `The new agent, "${forgedAgent.name}", has been summoned to the canvas.`,
    });
    
    handleCancelForge();
  };

  const handleCancelForge = () => {
    setIsForging(false);
    setForgePrompt('');
    setRitual('idle');
  };

  const handleUpdateNode = (nodeId: string, newPrompt: string) => {
    setNodes(currentNodes => 
      currentNodes.map(node => 
        node.id === nodeId ? { ...node, prompt: newPrompt } : node
      )
    );
     toast({
        title: "Agent Updated",
        description: "The agent's incantation has been successfully refined.",
    });
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header onForge={handleStartForge} isForging={isForging} />

      {isForging && (
        <ForgeDialog 
          isOpen={isForging}
          prompt={forgePrompt}
          onFinalize={handleFinalizeForge}
          onCancel={handleCancelForge}
        />
      )}

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
          onUpdateNode={handleUpdateNode}
        />
      </main>
      <BottomBar
        onTogglePalette={() => setIsPaletteOpen(p => !p)}
        onToggleInspector={() => setIsInspectorOpen(p => !p)}
      />
    </div>
  );
}
