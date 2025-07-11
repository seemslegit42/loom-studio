
'use client';
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import Header from '@/components/loom/header';
import IncantationEditor from '@/components/loom/incantation-editor';
import EventTimeline from '@/components/loom/event-timeline';

import { analyzePromptChange } from '@/ai/flows/analyze-prompt-change-flow';
import type { AnalyzePromptChangeInput } from '@/ai/flows/analyze-prompt-change-schema';
import { generateAgentAvatar } from '@/ai/flows/generate-agent-avatar-flow';
import { analyzeAgentProfile, AnalyzeAgentProfileOutput } from '@/ai/flows/analyze-agent-profile-flow';
import { useToast } from '@/hooks/use-toast';
import { INITIAL_AVATAR, INITIAL_MODIFIED_PROMPT, INITIAL_NAME, INITIAL_ORIGINAL_PROMPT, INITIAL_PROFILE } from './loom-constants';
import { type NodeState } from './hall-of-echoes';
import { SigilRites } from '../sigil-rites/SigilRites';
import { useSystemSigilState } from '@/hooks/use-system-sigil-state';

type AgentProfile = AnalyzeAgentProfileOutput['profile'];

const INITIAL_WORKFLOW_NODES: NodeState[] = [
  { id: 'analysis', title: 'Analyze Behavior', status: 'idle', content: 'Awaiting analysis.' },
  { id: 'avatar', title: 'Generate Avatar', status: 'idle', content: 'Awaiting generation.', isImage: true },
  { id: 'profile', title: 'Profile Personality', status: 'idle', content: 'Awaiting profiling.' },
];

export interface Snapshot {
  id: string;
  capturedAt: Date;
  agentName: string;
  agentAvatar: string;
  agentProfile: AgentProfile;
  originalPrompt: string;
  modifiedPrompt: string;
}

// Define the shape of the context
interface LoomContextType {
  isProcessing: boolean;
  agentName: string;
  agentAvatar: string;
  agentProfile: AgentProfile;
  originalPrompt: string;
  modifiedPrompt: string;
  setOriginalPrompt: (prompt: string) => void;
  setModifiedPrompt: (prompt: string) => void;
  handlePromptUpdate: (data: AnalyzePromptChangeInput) => Promise<void>;
  snapshots: Snapshot[];
  captureSnapshot: () => void;
  restoreSnapshot: (id: string) => void;
  deleteSnapshot: (id: string) => void;
  resetToInitialState: () => void;

  // Engine Tuning State
  creativity: number;
  setCreativity: (value: number) => void;
  riskAversion: number;
  setRiskAversion: (value: number) => void;
  transmutationTithe: number;
  setTransmutationTithe: (value: number) => void;

  // Timeline State
  timelineProgress: number;
  setTimelineProgress: (progress: number) => void;
  timelineDuration: number;
  isPlaying: boolean;
  isFinished: boolean;
  play: () => void;
  pause: () => void;
  rewind: () => void;
  fastForward: () => void;
  runSimulation: () => void;
  resetSimulation: () => void;
  
  // Hall of Echoes state
  workflowNodes: NodeState[];
}

// Create the context with a default value
const LoomContext = createContext<LoomContextType | undefined>(undefined);


// Create the provider component
export default function LoomProvider({ children }: { children?: ReactNode }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentName, setAgentName] = useState(INITIAL_NAME);
  const [agentAvatar, setAgentAvatar] = useState(INITIAL_AVATAR);
  const [agentProfile, setAgentProfile] = useState<AgentProfile>(INITIAL_PROFILE);
  const [originalPrompt, setOriginalPrompt] = useState(INITIAL_ORIGINAL_PROMPT);
  const [modifiedPrompt, setModifiedPrompt] = useState(INITIAL_MODIFIED_PROMPT);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const { toast } = useToast();
  
  // View state
  const [workflowNodes, setWorkflowNodes] = useState<NodeState[]>(INITIAL_WORKFLOW_NODES);
  const { variant, ritual, setRitual } = useSystemSigilState();

  // Engine Tuning State
  const [creativity, setCreativity] = useState(65);
  const [riskAversion, setRiskAversion] = useState(20);
  const [transmutationTithe, setTransmutationTithe] = useState(10);

  // Timeline State
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const timelineDuration = 90; // in seconds

  const runSimulation = useCallback(() => {
    setRitual('summon');
    setIsPlaying(true);
    setIsFinished(false);
    setTimelineProgress(0);
  }, [setRitual]);

  const resetSimulation = useCallback(() => {
    setRitual('idle');
    setIsPlaying(false);
    setIsFinished(false);
    setTimelineProgress(0);
  }, [setRitual]);

  const play = useCallback(() => {
    if (!isFinished) {
      setIsPlaying(true);
      setRitual('orchestrate');
    }
  }, [isFinished, setRitual]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    setRitual('idle');
  }, [setRitual]);

  const rewind = useCallback(() => {
    setTimelineProgress(prev => Math.max(0, prev - 5));
  }, []);

  const fastForward = useCallback(() => {
    setTimelineProgress(prev => Math.min(timelineDuration, prev + 5));
  }, [timelineDuration]);

  const resetToInitialState = () => {
    setIsProcessing(false);
    setAgentName(INITIAL_NAME);
    setAgentAvatar(INITIAL_AVATAR);
    setAgentProfile(INITIAL_PROFILE);
    setOriginalPrompt(INITIAL_ORIGINAL_PROMPT);
    setModifiedPrompt(INITIAL_MODIFIED_PROMPT);
    setWorkflowNodes(INITIAL_WORKFLOW_NODES);
    resetSimulation();
    toast({ title: "Workspace Cleared", description: "Ready to create a new agent." });
  };

  const handlePromptUpdate = async (data: AnalyzePromptChangeInput): Promise<void> => {
    setIsProcessing(true);
    
    // Set all nodes to running state
    setWorkflowNodes(prev => prev.map(node => ({ ...node, status: 'running', content: 'Processing...' })));

    try {
      const results = await Promise.allSettled([
        analyzePromptChange(data),
        generateAgentAvatar({ prompt: data.modifiedPrompt }),
        analyzeAgentProfile({ prompt: data.modifiedPrompt })
      ]);
      
      const [analysisResult, avatarResult, profileResult] = results;

      if (analysisResult.status === 'fulfilled') {
        const { analysis } = analysisResult.value;
        toast({ title: 'Behavioral Analysis Complete', description: analysis });
        setWorkflowNodes(prev => prev.map(n => n.id === 'analysis' ? { ...n, status: 'success', content: analysis } : n));
      } else {
        console.error("Analysis failed:", analysisResult.reason);
        toast({ variant: 'destructive', title: 'Error', description: 'Behavioral analysis failed.' });
        setWorkflowNodes(prev => prev.map(n => n.id === 'analysis' ? { ...n, status: 'error', content: 'Analysis failed.' } : n));
      }

      if (avatarResult.status === 'fulfilled') {
        const { avatarDataUri } = avatarResult.value;
        setAgentAvatar(avatarDataUri);
        setWorkflowNodes(prev => prev.map(n => n.id === 'avatar' ? { ...n, status: 'success', content: avatarDataUri } : n));
      } else {
        console.error("Avatar generation failed:", avatarResult.reason);
        setAgentAvatar(INITIAL_AVATAR);
        toast({ variant: 'destructive', title: 'Error', description: 'Avatar generation failed.' });
        setWorkflowNodes(prev => prev.map(n => n.id === 'avatar' ? { ...n, status: 'error', content: 'Generation failed.' } : n));
      }

      if (profileResult.status === 'fulfilled') {
        const { name, profile } = profileResult.value;
        setAgentName(name);
        setAgentProfile(profile);
        setWorkflowNodes(prev => prev.map(n => n.id === 'profile' ? { ...n, status: 'success', content: `Agent name set to "${name}". Profile updated.` } : n));
      } else {
        console.error("Profile analysis failed:", profileResult.reason);
        setAgentName(INITIAL_NAME);
        setAgentProfile(INITIAL_PROFILE);
        toast({ variant: 'destructive', title: 'Error', description: 'Profile analysis failed.' });
        setWorkflowNodes(prev => prev.map(n => n.id === 'profile' ? { ...n, status: 'error', content: 'Profiling failed.' } : n));
      }

    } catch (error) {
      console.error("An error occurred during prompt update processing:", error);
      toast({ variant: 'destructive', title: 'System Error', description: 'A critical error occurred.' });
      setAgentAvatar(INITIAL_AVATAR);
      setAgentName(INITIAL_NAME);
      setAgentProfile(INITIAL_PROFILE);
      setWorkflowNodes(prev => prev.map(node => ({ ...node, status: 'error', content: 'System error.' })));
    } finally {
      setIsProcessing(false);
    }
  };

  const captureSnapshot = () => {
    const newSnapshot: Snapshot = {
      id: `snap_${new Date().getTime()}`,
      capturedAt: new Date(),
      agentName,
      agentAvatar,
      agentProfile,
      originalPrompt,
      modifiedPrompt,
    };
    setSnapshots(prev => [newSnapshot, ...prev]);
    toast({ title: 'Snapshot Captured', description: `State of agent "${agentName}" has been saved.`});
  };

  const restoreSnapshot = (id: string) => {
    const snapshotToRestore = snapshots.find(s => s.id === id);
    if (snapshotToRestore) {
      setAgentName(snapshotToRestore.agentName);
      setAgentAvatar(snapshotToRestore.agentAvatar);
      setAgentProfile(snapshotToRestore.agentProfile);
      setOriginalPrompt(snapshotToRestore.originalPrompt);
      setModifiedPrompt(snapshotToRestore.modifiedPrompt);
      setWorkflowNodes(INITIAL_WORKFLOW_NODES);
      resetSimulation();
      toast({ title: 'Snapshot Restored', description: `Agent state restored to "${snapshotToRestore.agentName}".` });
    }
  };

  const deleteSnapshot = (id: string) => {
    setSnapshots(prev => prev.filter(s => s.id !== id));
    toast({ title: 'Snapshot Deleted', description: 'The selected snapshot has been removed.' });
  };


  const value = {
    isProcessing,
    agentName,
    agentAvatar,
    agentProfile,
    originalPrompt,
    modifiedPrompt,
    setOriginalPrompt,
    setModifiedPrompt,
    handlePromptUpdate,
    snapshots,
    captureSnapshot,
    restoreSnapshot,
    deleteSnapshot,
    resetToInitialState,

    creativity,
    setCreativity: (val: number) => setCreativity(val),
    riskAversion,
    setRiskAversion: (val: number) => setRiskAversion(val),
    transmutationTithe,
    setTransmutationTithe: (val: number) => setTransmutationTithe(val),

    timelineProgress,
    setTimelineProgress,
    timelineDuration,
    isPlaying,
    isFinished,
    play,
    pause,
    rewind,
    fastForward,
    runSimulation,
    resetSimulation,

    workflowNodes,
  };

  return (
    <LoomContext.Provider value={value}>
        <div className="bg-transparent text-foreground min-h-screen flex flex-col font-body">
            <Header />
            <div className="flex-1 flex flex-col overflow-hidden pt-24">
                <main className="flex-1 p-6 lg:p-8 flex flex-col gap-6 lg:gap-8 overflow-y-auto">
                    <div className="flex items-center justify-center">
                        <SigilRites variant={variant} ritual={ritual} onRitualComplete={() => setRitual('idle')} />
                    </div>
                    <div className="flex-1 flex flex-col">
                        <IncantationEditor />
                    </div>
                </main>
            </div>
            <EventTimeline />
        </div>
    </LoomContext.Provider>
  );
}

// Create a custom hook to use the context
export const useLoom = (): LoomContextType => {
  const context = useContext(LoomContext);
  if (context === undefined) {
    throw new Error('useLoom must be used within a LoomProvider');
  }
  return context;
};
