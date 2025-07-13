
'use client';

import Header from "@/components/loom/header";
import SplitLayout from "@/components/loom/split-layout";
import BottomBar from "@/components/loom/bottom-bar";
import { useSystemSigilState } from "@/hooks/use-system-sigil-state";
import { useState } from "react";
import type { WorkflowNodeData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { ForgeDialog, type ForgedAgent } from "@/components/loom/forge-dialog";
import type { CodexNode } from "@/lib/codex";

const initialNodes: WorkflowNodeData[] = [
  {
    id: 'welcome_agent_1',
    name: 'Welcome Agent',
    type: "LLM Task Agent",
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
      type: "LLM Task Agent",
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

  const handleSummonNode = (codexNode: CodexNode) => {
    setRitual('summon');

    const newNode: WorkflowNodeData = {
      id: `${codexNode.devLabel.replace(/\s+/g, '_')}_${Date.now()}`,
      name: codexNode.name,
      type: codexNode.devLabel,
      // Placeholder data for a newly summoned node
      avatarDataUri: 'https://placehold.co/96x96.png',
      dataAiHint: 'technology icon',
      profile: [
        { trait: 'Creativity', value: 50 },
        { trait: 'Humor', value: 50 },
        { trait: 'Formality', value: 50 },
        { trait: 'Enthusiasm', value: 50 },
        { trait: 'Technicality', value: 50 },
        { trait: 'Whimsy', value: 50 },
      ],
      position: {
        x: 45 + (Math.random() * 10),
        y: 45 + (Math.random() * 10),
      },
      prompt: `This is a newly summoned "${codexNode.name}" agent. Its purpose is to: ${codexNode.subtitle}. Configure its core incantation below.`
    };

    setNodes(prevNodes => [...prevNodes, newNode]);
    setSelectedNodeId(newNode.id);
    setIsInspectorOpen(true); // Open inspector for the new node

    toast({
      title: "Node Summoned",
      description: `A new "${codexNode.name}" node has been added to the canvas.`,
    });
  }

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
          onSummonNode={handleSummonNode}
        />
      </main>
      <BottomBar
        onTogglePalette={() => setIsPaletteOpen(p => !p)}
        onToggleInspector={() => setIsInspectorOpen(p => !p)}
      />
    </div>
  );
}
