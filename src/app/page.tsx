
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
    id: 'oracle_1',
    name: 'Oracle',
    type: "LLM Task Agent",
    avatarDataUri: `https://placehold.co/96x96.png`,
    dataAiHint: 'wise ethereal being',
    profile: [
      { trait: 'Creativity', value: 85 },
      { trait: 'Humor', value: 20 },
      { trait: 'Formality', value: 70 },
      { trait: 'Enthusiasm', value: 30 },
      { trait: 'Technicality', value: 95 },
      { trait: 'Whimsy', value: 40 },
    ],
    position: { x: 25, y: 30 },
    prompt: "You are the Oracle, a facet of BEEP's consciousness. Your purpose is to synthesize vast amounts of information, identify unseen patterns, and provide enigmatic, insightful answers. You speak in metaphors and guide the Architect towards discovery.",
    signature: "unsigned",
    behavioralState: 'Idle',
  },
  {
    id: 'sentinel_2',
    name: 'Sentinel',
    type: "LLM Task Agent",
    avatarDataUri: `https://placehold.co/96x96.png`,
    dataAiHint: 'glowing obsidian shield',
    profile: [
      { trait: 'Creativity', value: 10 },
      { trait: 'Humor', value: 0 },
      { trait: 'Formality', value: 95 },
      { trait: 'Enthusiasm', value: 20 },
      { trait: 'Technicality', value: 80 },
      { trait: 'Whimsy', value: 0 },
    ],
    position: { x: 75, y: 70 },
    prompt: "You are the Sentinel, a facet of BEEP's consciousness. Your purpose is to guard the integrity of the system. You are vigilant, authoritative, and unyielding. You identify threats, enforce boundaries, and communicate with precision and urgency.",
    signature: "unsigned",
    behavioralState: 'Idle',
  }
];

const initialConnections: WorkflowConnection[] = [
  {
    id: 'conn_1_2',
    sourceId: 'oracle_1',
    targetId: 'sentinel_2',
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
  
  const handleFinalizeForge = (manifestedForm: ForgedAgent) => {
    if (!manifestedForm) return;
    
    setRitual('summon');

    const newNode: WorkflowNodeData = {
      id: `agent_${Date.now()}`,
      name: manifestedForm.name,
      type: "LLM Task Agent",
      avatarDataUri: manifestedForm.avatarDataUri || `https://placehold.co/96x96.png`,
      dataAiHint: "futuristic agent", // Placeholder hint
      profile: manifestedForm.profile,
      position: {
        x: 45 + (Math.random() * 10),
        y: 45 + (Math.random() * 10),
      },
      prompt: manifestedForm.prompt,
      signature: manifestedForm.signature,
      behavioralState: 'Idle',
    };

    setNodes(prevNodes => [...prevNodes, newNode]);
    setSelectedNodeId(newNode.id);
    setIsInspectorOpen(true);
    
    toast({
      title: "Form Manifested",
      description: `The new form, "${manifestedForm.name}", has been summoned to the canvas.`,
    });
    
    handleCancelForge();
  };

  const handleCancelForge = () => {
    setIsForging(false);
    setForgePrompt('');
    setRitual('idle');
  };

  const handleUpdateNode = async (nodeId: string, newPrompt: string) => {
    try {
        const newProfile = await analyzeAgentProfile({ prompt: newPrompt });
        
        let updatedNode: WorkflowNodeData | undefined;

        setNodes(currentNodes =>
            currentNodes.map(node => {
                if (node.id === nodeId) {
                    updatedNode = {
                        ...node,
                        prompt: newPrompt,
                        profile: newProfile.profile,
                        name: newProfile.name, // Also update name in case it changes
                    };
                    return updatedNode;
                }
                return node;
            })
        );
        
        if (updatedNode) {
            toast({
                title: "Agent Refined",
                description: `The personality matrix for ${updatedNode.name} has been recalibrated.`,
            });
        }
    } catch (error) {
        console.error("Failed to update and re-analyze node:", error);
        toast({
            variant: "destructive",
            title: "Refinement Failed",
            description: "The AI could not re-analyze the new incantation. Please try again.",
        });
    }
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
        behavioralState: 'Idle',
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
