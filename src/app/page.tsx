
'use client';

import Header from "@/components/loom/header";
import SplitLayout from "@/components/loom/split-layout";
import BottomBar from "@/components/loom/bottom-bar";
import { useSystemSigilState } from "@/hooks/use-system-sigil-state";
import { useState } from "react";
import type { WorkflowNodeData, WorkflowConnection } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import type { ForgedAgent } from "@/components/loom/genesis-chamber";
import type { CodexNode } from "@/lib/codex";
import { analyzeAgentProfile } from "@/ai/flows/analyze-agent-profile-flow";
import { generateAgentAvatar } from "@/ai/flows/generate-agent-avatar-flow";
import { createNexusAgent } from "@/ai/flows/create-nexus-agent-flow";
import { refineAgentPrompt } from "@/ai/flows/refine-agent-prompt-flow";
import { generateWorkflowFromPrompt } from "@/ai/flows/generate-workflow-from-prompt-flow";
import { useLoomStore } from "@/hooks/useLoomStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoomOfFatesPanel } from "@/components/loom/loom-of-fates-panel";


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
    avatarDataUri: `https://images.unsplash.com/photo-1619734916059-a86a6e788755?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxnbG93aW5nJTIwb2JzaWRpYW4lMjBzaGllbGR8ZW58MHx8fHwxNzUyMzkwMzA3fDA&ixlib=rb-4.1.0&q=80&w=1080`,
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

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * The main page component for Loom Studio, serving as the root of the application's UI.
 * It orchestrates the header, the main split-view layout, and the mobile-only bottom bar.
 *
 * @returns {JSX.Element} The rendered home page.
 */
export default function Home() {
  const { ritual, setRitual } = useSystemSigilState();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false); // Default to open
  
  const [nodes, setNodes] = useState<WorkflowNodeData[]>(initialNodes);
  const [connections, setConnections] = useState<WorkflowConnection[]>(initialConnections);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);

  const [genesisPrompt, setGenesisPrompt] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState(false);
  
  const { toast } = useToast();
  const { logAction } = useLoomStore();

  const handleStartForge = async (prompt: string) => {
    if (!prompt.trim()) return;
    logAction('FORGE_INITIATED', { prompt });
    setRitual('summon');
    setSelectedNodeId(null);
    setGenesisPrompt(''); // Clear genesis prompt if any
    setIsInspectorOpen(false); // Hide inspector during full workflow forge
    
    try {
        toast({ title: "Incantation Received", description: "The Loom is weaving your workflow..." });
        
        const result = await generateWorkflowFromPrompt({ prompt });

        if (result.nodes.length === 1 && result.connections.length === 0) {
            // If the AI decides to create just one agent, use the Genesis Chamber flow
            setGenesisPrompt(result.nodes[0].prompt || prompt);
            setIsInspectorOpen(true);
            setRitual('idle'); // Let genesis chamber handle its own ritual
        } else {
            // For a full workflow, manifest it directly
            setNodes(result.nodes);
            setConnections(result.connections);
            
            toast({
                title: "Workflow Manifested",
                description: `${result.nodes.length} agents and ${result.connections.length} connections have been forged.`,
            });
            logAction('WORKFLOW_FORGED', { prompt, nodeCount: result.nodes.length, connectionCount: result.connections.length });
            setRitual('idle');
        }

    } catch (error) {
        console.error("Failed to forge workflow from prompt:", error);
        logAction('FORGE_FAILED', { prompt, error: (error as Error).message });
        toast({
            variant: "destructive",
            title: "The Loom Falters",
            description: "The AI could not manifest a workflow from the incantation. Please try again.",
        });
        setRitual('idle');
    }
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

    logAction('AGENT_SUMMONED', { agentId: newNode.id, agentName: newNode.name, method: 'Genesis Chamber' });
    setNodes(prevNodes => [...prevNodes, newNode]);
    setSelectedNodeId(newNode.id);
    setIsInspectorOpen(true);
    
    toast({
      title: "Form Manifested",
      description: `The new form, "${manifestedForm.name}", has been summoned to the canvas.`,
    });

    setGenesisPrompt(''); // Clear the prompt after finalizing
    setRitual('idle');
  };

  const handleCancelForge = () => {
    logAction('FORGE_CANCELLED', { prompt: genesisPrompt });
    setGenesisPrompt('');
    setRitual('idle');
  };

  const handleUpdateNode = async (nodeId: string, newPrompt: string, newProfile?: WorkflowNodeData['profile']) => {
    const nodeToUpdate = nodes.find(node => node.id === nodeId);
    if (!nodeToUpdate) return;
    
    // If a new profile is provided, it means this is a sculpting action.
    // The prompt will be refined by the AI.
    // If no new profile, it's a manual prompt update.
    const isSculpting = !!newProfile;
    const actionType = isSculpting ? 'AGENT_SCULPTED' : 'PROMPT_UPDATED';
    logAction(actionType, { agentId: nodeId, agentName: nodeToUpdate.name });

    try {
        let finalPrompt = newPrompt;
        
        if (isSculpting && newProfile) {
            const refined = await refineAgentPrompt({
                originalPrompt: nodeToUpdate.prompt,
                targetProfile: newProfile,
            });
            finalPrompt = refined.refinedPrompt;
        }

        const reanalyzedProfile = await analyzeAgentProfile({ prompt: finalPrompt });
        const newAvatar = await generateAgentAvatar({
            prompt: finalPrompt,
            profile: reanalyzedProfile.profile,
            selectedStyle: reanalyzedProfile.recommendedStyle,
        });
        
        let updatedNode: WorkflowNodeData | null = null;
        setNodes(currentNodes =>
            currentNodes.map(node => {
                if (node.id === nodeId) {
                    updatedNode = {
                        ...node,
                        prompt: finalPrompt,
                        profile: reanalyzedProfile.profile,
                        name: reanalyzedProfile.name,
                        avatarDataUri: newAvatar.avatarDataUri,
                    };
                    return updatedNode;
                }
                return node;
            })
        );
        
        logAction('AGENT_REFORGED', { agentId: nodeId, agentName: reanalyzedProfile.name });
        toast({
            title: "Identity Re-Forged",
            description: `The personality matrix and visual form for ${reanalyzedProfile.name} have been recalibrated.`,
        });

    } catch (error) {
        console.error("Failed to update and re-forge node:", error);
        logAction('AGENT_REFORGE_FAILED', { agentId: nodeId, error: (error as Error).message });
        toast({
            variant: "destructive",
            title: "Re-Forging Failed",
            description: "The AI could not recalibrate the agent's identity. Please try again.",
        });
    }
  };


  const handleNexusSummon = async (connectionId: string) => {
    setRitual('transmute');
    const connection = connections.find(c => c.id === connectionId);
    if (!connection) {
        toast({ variant: 'destructive', title: 'Nexus Error', description: 'Connection not found.' });
        setRitual('idle');
        return;
    }

    const sourceNode = nodes.find(n => n.id === connection.sourceId);
    const targetNode = nodes.find(n => n.id === connection.targetId);

    if (!sourceNode || !targetNode) {
        toast({ variant: 'destructive', title: 'Nexus Error', description: 'Source or target node not found.' });
        setRitual('idle');
        return;
    }
    
    logAction('NEXUS_SUMMON_INITIATED', { sourceId: sourceNode.id, targetId: targetNode.id });

    try {
        toast({ title: "Nexus Invoked", description: "The void whispers... forging a new form to bridge the gap." });

        const newNode = await createNexusAgent({
            sourcePrompt: sourceNode.prompt,
            targetPrompt: targetNode.prompt,
        });

        // Position the new node halfway between the source and target
        const sourcePos = sourceNode.position;
        const targetPos = targetNode.position;
        newNode.position = {
            x: (sourcePos.x + targetPos.x) / 2,
            y: (sourcePos.y + targetPos.y) / 2,
        };

        // Add the new node and rewire the connections
        setNodes(prev => [...prev, newNode]);
        setConnections(prev => [
            // Remove the old connection
            ...prev.filter(c => c.id !== connectionId),
            // Add new connections
            { id: `conn_${sourceNode.id}_${newNode.id}`, sourceId: sourceNode.id, targetId: newNode.id },
            { id: `conn_${newNode.id}_${targetNode.id}`, sourceId: newNode.id, targetId: newNode.id },
        ]);

        setSelectedNodeId(newNode.id);
        setIsInspectorOpen(true);
        logAction('AGENT_SUMMONED', { agentId: newNode.id, agentName: newNode.name, method: 'Nexus Invocation' });
        toast({ title: "Nexus Agent Forged", description: `"${newNode.name}" has manifested to complete the sequence.` });

    } catch (error) {
        console.error("Failed to create Nexus agent:", error);
        logAction('NEXUS_SUMMON_FAILED', { sourceId: sourceNode.id, targetId: targetNode.id, error: (error as Error).message });
        toast({
            variant: "destructive",
            title: "Nexus Failed",
            description: "The AI could not forge a new agent to bridge the connection.",
        });
    } finally {
        setRitual('idle');
    }
  };


  const handleSummonNode = async (codexNode: CodexNode) => {
    // This is a special case for the revolutionary Nexus agent.
    if (codexNode.devLabel === "Nexus Agent") {
        if (selectedConnectionId) {
            handleNexusSummon(selectedConnectionId);
        } else {
            toast({
                variant: 'destructive',
                title: "Nexus requires a connection",
                description: "Select a connection on the canvas before summoning a Nexus agent.",
            });
        }
        return;
    }

    setRitual('summon');
    logAction('PALETTE_SUMMON_INITIATED', { nodeType: codexNode.name });
    
    try {
      const seedPrompt = `Analyze the profile for an agent named "${codexNode.name}". Its purpose is to: ${codexNode.subtitle}. Description: ${codexNode.tooltip}`;
      const profile = await analyzeAgentProfile({ prompt: seedPrompt });

      const avatar = await generateAgentAvatar({
        prompt: seedPrompt,
        profile: profile.profile,
        selectedStyle: profile.recommendedStyle,
      });

      const newNode: WorkflowNodeData = {
        id: `${codexNode.devLabel.replace(/\s+/g, '_')}_${Date.now()}`,
        name: profile.name,
        type: codexNode.devLabel,
        avatarDataUri: avatar.avatarDataUri || `https://placehold.co/96x96.png`,
        dataAiHint: 'technology icon', // This could be improved
        profile: profile.profile,
        position: {
          x: 45 + (Math.random() * 10),
          y: 45 + (Math.random() * 10),
        },
        prompt: `This is the newly summoned "${profile.name}" agent. Its purpose, derived from the "${codexNode.name}" primitive, is to: ${codexNode.subtitle}. Configure its core incantation below.`,
        signature: 'unsigned', // Summoned nodes are unsigned by default
        behavioralState: 'Idle',
      };

      setNodes(prevNodes => [...prevNodes, newNode]);
      setSelectedNodeId(newNode.id);
      setIsInspectorOpen(true);
      logAction('AGENT_SUMMONED', { agentId: newNode.id, agentName: profile.name, method: 'Palette' });

      toast({
        title: "Node Summoned",
        description: `A new agent, "${profile.name}", has been manifested on the canvas.`,
      });
    } catch (error) {
       console.error("Failed to summon and manifest node:", error);
       logAction('PALETTE_SUMMON_FAILED', { nodeType: codexNode.name, error: (error as Error).message });
       toast({
         variant: "destructive",
         title: "Summoning Failed",
         description: "The AI could not forge a complete identity for the new node. Please try again.",
       });
    } finally {
        setRitual('idle');
    }
  }
  
  const handleDelete = () => {
    if (selectedNodeId) {
        const nodeToDelete = nodes.find(n => n.id === selectedNodeId);
        logAction('NODE_DELETED', { nodeId: selectedNodeId, nodeName: nodeToDelete?.name });
        setNodes(current => current.filter(node => node.id !== selectedNodeId));
        setConnections(current => current.filter(conn => conn.sourceId !== selectedNodeId && conn.targetId !== selectedNodeId));
        setSelectedNodeId(null);
        toast({ title: "Agent Dismissed", description: `"${nodeToDelete?.name}" has been returned to the aether.` });
    } else if (selectedConnectionId) {
        logAction('CONNECTION_DELETED', { connectionId: selectedConnectionId });
        setConnections(current => current.filter(conn => conn.id !== selectedConnectionId));
        setSelectedConnectionId(null);
        toast({ title: "Connection Severed", description: "The link between agents has been broken." });
    }
  };

  const handleCreateConnection = (sourceId: string, targetId: string) => {
    const newConnection: WorkflowConnection = {
      id: `conn_${sourceId}_${targetId}_${Date.now()}`,
      sourceId,
      targetId,
    };
    setConnections(prev => [...prev, newConnection]);
    logAction('CONNECTION_CREATED', { sourceId, targetId });
  };
  
  const handleRunWorkflow = async () => {
    if (isExecuting || nodes.length === 0) return;

    setIsExecuting(true);
    logAction('WORKFLOW_EXECUTION_STARTED');
    toast({ title: 'Workflow Executing', description: 'The Loom begins to weave...' });
    
    // Simple topological sort
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const adj = new Map<string, string[]>(nodes.map(n => [n.id, []]));
    const inDegree = new Map<string, number>(nodes.map(n => [n.id, 0]));

    for (const conn of connections) {
        adj.get(conn.sourceId)?.push(conn.targetId);
        inDegree.set(conn.targetId, (inDegree.get(conn.targetId) || 0) + 1);
    }

    const queue = nodes.filter(n => inDegree.get(n.id) === 0).map(n => n.id);
    const sortedOrder: string[] = [];

    while (queue.length > 0) {
        const u = queue.shift()!;
        sortedOrder.push(u);
        for (const v of (adj.get(u) || [])) {
            inDegree.set(v, (inDegree.get(v) || 0) - 1);
            if (inDegree.get(v) === 0) {
                queue.push(v);
            }
        }
    }

    // Execution simulation
    for (const nodeId of sortedOrder) {
        const node = nodeMap.get(nodeId);
        if (!node) continue;
        
        logAction('AGENT_EXECUTION_STARTED', { agentId: node.id, agentName: node.name });
        setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, behavioralState: 'Executing' } : n));
        
        await sleep(1000); // Simulate work

        setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, behavioralState: 'Idle' } : n));
    }

    logAction('WORKFLOW_EXECUTION_COMPLETED');
    toast({ title: 'Workflow Complete', description: 'The sequence has finished.' });
    setIsExecuting(false);
  };


  const inspectorPanel = (
    <Tabs defaultValue="workflow" className="h-full flex flex-col">
      <div className="p-4 pb-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="fates">Loom of Fates</TabsTrigger>
          </TabsList>
      </div>
      <TabsContent value="workflow" className="flex-1 overflow-hidden">
         <SplitLayout.InspectorPanelContent
            selectedNodeId={selectedNodeId}
            nodes={nodes}
            connections={connections}
            isExecuting={isExecuting}
            onUpdateNode={handleUpdateNode}
            onNexusSummon={handleNexusSummon}
            genesisPrompt={genesisPrompt}
            onFinalizeForge={handleFinalizeForge}
            onCancelForge={handleCancelForge}
          />
      </TabsContent>
      <TabsContent value="fates" className="flex-1 overflow-hidden">
          <LoomOfFatesPanel />
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header onForge={handleStartForge} onRunWorkflow={handleRunWorkflow} isExecuting={isExecuting} hasNodes={nodes.length > 0} />

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
          setConnections={setConnections}
          selectedNodeId={selectedNodeId}
          setSelectedNodeId={setSelectedNodeId}
          selectedConnectionId={selectedConnectionId}
          setSelectedConnectionId={setSelectedConnectionId}
          onUpdateNode={handleUpdateNode}
          onSummonNode={handleSummonNode}
          onNexusSummon={handleNexusSummon}
          onDelete={handleDelete}
          onCreateConnection={handleCreateConnection}
          isExecuting={isExecuting}
          inspectorPanel={inspectorPanel}
        />
      </main>
      <BottomBar
        onTogglePalette={() => setIsPaletteOpen(p => !p)}
        onToggleInspector={() => setIsInspectorOpen(p => !p)}
      />
    </div>
  );
}
