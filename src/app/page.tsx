
'use client';

import Header from "@/components/loom/header";
import SplitLayout from "@/components/loom/split-layout";
import BottomBar from "@/components/loom/bottom-bar";
import { useSystemSigilState } from "@/hooks/use-system-sigil-state";
import { useState } from "react";
import type { WorkflowNodeData, WorkflowConnection } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { ForgeDialog, type ForgedAgent } from "@/components/loom/forge-dialog";
import type { CodexNode } from "@/lib/codex";
import { analyzeAgentProfile } from "@/ai/flows/analyze-agent-profile-flow";

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
    position: { x: 25, y: 30 },
    prompt: "You are a helpful and welcoming agent designed to introduce users to Loom Studio.",
    signature: "unsigned"
  },
  {
    id: 'followup_agent_2',
    name: 'Follow-up Agent',
    type: "LLM Task Agent",
    avatarDataUri: `https://placehold.co/96x96.png`,
    dataAiHint: 'questioning robot',
    profile: [
      { trait: 'Creativity', value: 60 },
      { trait: 'Humor', value: 50 },
      { trait: 'Formality', value: 70 },
      { trait: 'Enthusiasm', value: 80 },
      { trait: 'Technicality', value: 50 },
      { trait: 'Whimsy', value: 40 },
    ],
    position: { x: 75, y: 70 },
    prompt: "You are a follow-up agent. Your job is to ask the user what they would like to build today.",
    signature: "unsigned"
  }
];

const initialConnections: WorkflowConnection[] = [
  {
    id: 'conn_1_2',
    sourceId: 'welcome_agent_1',
    targetId: 'followup_agent_2',
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
  const [connections, setConnections] = useState<WorkflowConnection[]>(initialConnections);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

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
      signature: forgedAgent.signature,
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

  const handleSummonNode = async (codexNode: CodexNode) => {
    setRitual('summon');
    
    try {
      const seedPrompt = `Analyze the profile for an agent named "${codexNode.name}". Its purpose is to: ${codexNode.subtitle}. Description: ${codexNode.tooltip}`;
      const profile = await analyzeAgentProfile({ prompt: seedPrompt });

      const newNode: WorkflowNodeData = {
        id: `${codexNode.devLabel.replace(/\s+/g, '_')}_${Date.now()}`,
        name: profile.name,
        type: codexNode.devLabel,
        avatarDataUri: `https://placehold.co/96x96.png`,
        dataAiHint: 'technology icon',
        profile: profile.profile,
        position: {
          x: 45 + (Math.random() * 10),
          y: 45 + (Math.random() * 10),
        },
        prompt: `This is the newly summoned "${profile.name}" agent. Its purpose, derived from the "${codexNode.name}" primitive, is to: ${codexNode.subtitle}. Configure its core incantation below.`,
        signature: 'unsigned',
      };

      setNodes(prevNodes => [...prevNodes, newNode]);
      setSelectedNodeId(newNode.id);
      setIsInspectorOpen(true);

      toast({
        title: "Node Summoned",
        description: `A new agent, "${profile.name}", has been added to the canvas.`,
      });
    } catch (error) {
       console.error("Failed to summon node with AI profile:", error);
       toast({
         variant: "destructive",
         title: "Summoning Failed",
         description: "The AI could not forge a profile for the new node. Please try again.",
       });
    } finally {
        // The ritual completes in the SigilRites component, which will set it back to idle.
    }
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
          connections={connections}
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
