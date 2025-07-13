
'use client';

import Header from "@/components/loom/header";
import SplitLayout from "@/components/loom/split-layout";
import BottomBar from "@/components/loom/bottom-bar";
import { useSystemSigilState } from "@/hooks/use-system-sigil-state";
import { useState } from "react";
import type { WorkflowNodeData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { analyzeAgentProfile, type AnalyzeAgentProfileOutput } from "@/ai/flows/analyze-agent-profile-flow";
import { generateAgentAvatar } from "@/ai/flows/generate-agent-avatar-flow";
import { ForgeDialog } from "@/components/loom/forge-dialog";

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

export type ForgeStep = 'inactive' | 'profiling' | 'reviewing' | 'generatingAvatar' | 'complete';
export type ForgeData = AnalyzeAgentProfileOutput & { prompt: string, avatarDataUri?: string };

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
  const [forgeStep, setForgeStep] = useState<ForgeStep>('inactive');
  const [forgeData, setForgeData] = useState<ForgeData | null>(null);

  const { toast } = useToast();

  const handleStartForge = async (prompt: string) => {
    if (!prompt.trim()) return;

    setIsForging(true);
    setForgeStep('profiling');
    setRitual('orchestrate');

    try {
      const profileResult = await analyzeAgentProfile({ prompt });
      setForgeData({ ...profileResult, prompt });
      setForgeStep('reviewing');
    } catch (error) {
      console.error("Agent profiling failed:", error);
      toast({
        variant: "destructive",
        title: "Aetheric Interference",
        description: "The agent's personality could not be analyzed. Please check the incantation.",
      });
      handleCancelForge();
    } finally {
       setRitual('idle');
    }
  };

  const handleRerollProfile = async () => {
    if (!forgeData) return;
    setForgeStep('profiling');
    try {
        const profileResult = await analyzeAgentProfile({ prompt: forgeData.prompt });
        setForgeData({ ...profileResult, prompt: forgeData.prompt });
        setForgeStep('reviewing');
    } catch (error) {
        console.error("Agent re-profiling failed:", error);
        toast({
            variant: "destructive",
            title: "Aetheric Interference",
            description: "Failed to forge a new profile. The spirits are restless.",
        });
        setForgeStep('reviewing'); // Go back to reviewing previous state
    }
  };
  
  const handleAcceptProfile = async () => {
    if (!forgeData) return;
    setForgeStep('generatingAvatar');
    try {
      const avatarResult = await generateAgentAvatar({ prompt: forgeData.prompt });
      setForgeData(prev => prev ? { ...prev, avatarDataUri: avatarResult.avatarDataUri } : null);
      setForgeStep('complete');
    } catch (error) {
      console.error("Avatar generation failed:", error);
      toast({
        variant: "destructive",
        title: "Visual Incoherence",
        description: "The agent's avatar could not be rendered. A default will be assigned.",
      });
       setForgeData(prev => prev ? { ...prev, avatarDataUri: `https://placehold.co/96x96.png` } : null);
       setForgeStep('complete');
    }
  };

  const handleRerollAvatar = async () => {
      if (!forgeData) return;
      setForgeStep('generatingAvatar');
      try {
          const avatarResult = await generateAgentAvatar({ prompt: forgeData.prompt });
          setForgeData(prev => prev ? { ...prev, avatarDataUri: avatarResult.avatarDataUri } : null);
          setForgeStep('complete');
      } catch (error) {
          console.error("Avatar re-generation failed:", error);
          toast({
              variant: "destructive",
              title: "Visual Incoherence",
              description: "Could not render a new avatar. The previous form remains.",
          });
          setForgeStep('complete');
      }
  };

  const handleFinalizeForge = () => {
    if (!forgeData) return;
    
    setRitual('summon');

    const newNode: WorkflowNodeData = {
      id: `agent_${Date.now()}`,
      name: forgeData.name,
      avatarDataUri: forgeData.avatarDataUri || `https://placehold.co/96x96.png`,
      dataAiHint: "futuristic agent", // Placeholder hint
      profile: forgeData.profile,
      position: {
        x: 45 + (Math.random() * 10),
        y: 45 + (Math.random() * 10),
      },
      prompt: forgeData.prompt,
    };

    setNodes(prevNodes => [...prevNodes, newNode]);
    setSelectedNodeId(newNode.id);
    setIsInspectorOpen(true);
    
    toast({
      title: "Agent Forged",
      description: `The new agent, "${forgeData.name}", has been summoned to the canvas.`,
    });
    
    handleCancelForge();
  };

  const handleCancelForge = () => {
    setIsForging(false);
    setForgeStep('inactive');
    setForgeData(null);
    setRitual('idle');
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header onForge={handleStartForge} isForging={isForging} />

      <ForgeDialog 
        isOpen={isForging}
        step={forgeStep}
        data={forgeData}
        onAcceptProfile={handleAcceptProfile}
        onRerollProfile={handleRerollProfile}
        onFinalize={handleFinalizeForge}
        onRerollAvatar={handleRerollAvatar}
        onCancel={handleCancelForge}
      />

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
        />
      </main>
      <BottomBar
        onTogglePalette={() => setIsPaletteOpen(p => !p)}
        onToggleInspector={() => setIsInspectorOpen(p => !p)}
      />
    </div>
  );
}
