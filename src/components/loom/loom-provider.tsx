
'use client';
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import Header from '@/components/loom/header';
import IncantationEditor from '@/components/loom/incantation-editor';
import EventTimeline from '@/components/loom/event-timeline';

import { analyzePromptChange } from '@/ai/flows/analyze-prompt-change-flow';
import type { AnalyzePromptChangeInput, AnalyzePromptChangeOutput } from '@/ai/flows/analyze-prompt-change-schema';
import { generateAgentAvatar, GenerateAgentAvatarOutput } from '@/ai/flows/generate-agent-avatar-flow';
import { analyzeAgentProfile, AnalyzeAgentProfileOutput } from '@/ai/flows/analyze-agent-profile-flow';
import { useToast } from '@/hooks/use-toast';
import { INITIAL_AVATAR, INITIAL_MODIFIED_PROMPT, INITIAL_NAME, INITIAL_ORIGINAL_PROMPT, INITIAL_PROFILE } from './loom-constants';
import HallOfEchoes, { type NodeState } from './hall-of-echoes';
import Sidebar from './sidebar';
import { cn } from '@/lib/utils';
import { ResonanceField } from './resonance-field';

type AgentProfile = AnalyzeAgentProfileOutput['profile'];

const INITIAL_WORKFLOW_NODES: NodeState[] = [
  { id: 'analysis', title: 'Analyze Behavior', status: 'idle', content: 'Awaiting analysis.' },
  { id: 'avatar', title: 'Generate Avatar', status: 'idle', content: 'Awaiting generation.', isImage: true },
  { id: 'profile', title: 'Profile Personality', status: 'idle', content: 'Awaiting profiling.' },
];

/**
 * @interface Snapshot
 * @description Defines the data structure for a behavioral snapshot of an agent.
 * It captures the complete state of an agent at a specific point in time.
 * @property {string} id - A unique identifier for the snapshot.
 * @property {Date} capturedAt - The timestamp when the snapshot was taken.
 * @property {string} agentName - The name of the agent at the time of the snapshot.
 * @property {string} agentAvatar - The data URI of the agent's avatar.
 * @property {AgentProfile} agentProfile - The personality profile of the agent.
 * @property {string} originalPrompt - The original prompt state.
 * @property {string} modifiedPrompt - The modified prompt state.
 */
export interface Snapshot {
  id: string;
  capturedAt: Date;
  agentName: string;
  agentAvatar: string;
  agentProfile: AgentProfile;
  originalPrompt: string;
  modifiedPrompt: string;
}

interface FinalWorkflowResults {
  analysis: AnalyzePromptChangeOutput | null;
  avatar: GenerateAgentAvatarOutput | null;
  profile: AnalyzeAgentProfileOutput | null;
}

/**
 * @interface LoomContextType
 * @description Defines the shape of the context provided by LoomProvider.
 * This context manages all the core state for the Loom Studio application.
 */
interface LoomContextType {
  /** Global loading state for AI operations. */
  isProcessing: boolean;
  /** The current name of the agent. */
  agentName: string;
  /** The data URI for the agent's current avatar. */
  agentAvatar: string;
  /** The agent's current personality profile. */
  agentProfile: AgentProfile;
  /** The original prompt text. */
  originalPrompt: string;
  /** The modified prompt text. */
  modifiedPrompt: string;
  /** Setter for the original prompt. */
  setOriginalPrompt: (prompt: string) => void;
  /** Setter for the modified prompt. */
  setModifiedPrompt: (prompt: string) => void;
  /** Handler function to process prompt updates and trigger AI flows. */
  handlePromptUpdate: (data: AnalyzePromptChangeInput) => Promise<void>;
  /** An array of captured agent state snapshots. */
  snapshots: Snapshot[];
  /** Function to capture the current agent state as a new snapshot. */
  captureSnapshot: () => void;
  /** Function to restore the agent state from a specific snapshot. */
  restoreSnapshot: (id: string) => void;
  /** Function to delete a specific snapshot. */
  deleteSnapshot: (id: string) => void;
  /** Function to reset the entire workspace to its initial state. */
  resetToInitialState: () => void;

  // Engine Tuning State
  /** The Base RTR parameter for the engine (0-100). */
  baseRTR: number;
  /** Setter for the Base RTR parameter. */
  setBaseRTR: (value: number) => void;
  /** The Pity Boon Threshold parameter for the engine (0-100). */
  pityBoonThreshold: number;
  /** Setter for the Pity Boon Threshold parameter. */
  setPityBoonThreshold: (value: number) => void;
  /** The Transmutation Tithe parameter for the engine (0-100). */
  transmutationTithe: number;
  /** Setter for the Transmutation Tithe parameter. */
  setTransmutationTithe: (value: number) => void;

  // Timeline State
  /** The current progress of the simulation timeline (in seconds). */
  timelineProgress: number;
  /** Setter for the timeline progress. */
  setTimelineProgress: (progress: number) => void;
  /** The total duration of the simulation timeline (in seconds). */
  timelineDuration: number;
  /** Boolean indicating if the timeline is currently playing. */
  isPlaying: boolean;
  /** Boolean indicating if the timeline has finished. */
  isFinished: boolean;
  /** Function to start or resume timeline playback. */
  play: () => void;
  /** Function to pause timeline playback. */
  pause: () => void;
  /** Function to rewind the timeline by a small amount. */
  rewind: () => void;
  /** Function to fast-forward the timeline by a small amount. */
  fastForward: () => void;
  /** Function to run the full simulation from the beginning. */
  runSimulation: () => void;
  /** Function to reset the simulation to its initial state. */
  resetSimulation: () => void;
  
  // Hall of Echoes state
  /** The array of nodes representing the current state of the workflow visualization. */
  workflowNodes: NodeState[];
}

// Create the context with a default value
const LoomContext = createContext<LoomContextType | undefined>(undefined);


/**
 * The main application provider for Loom Studio.
 * It encapsulates all core state management and business logic, providing them
 * to the rest of the application via the LoomContext.
 * @param {{ children?: ReactNode }} props - The props for the component.
 * @returns {JSX.Element} The rendered provider component.
 */
export default function LoomProvider({ children }: { children?: ReactNode }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentName, setAgentName] = useState(INITIAL_NAME);
  const [agentAvatar, setAgentAvatar] = useState(INITIAL_AVATAR);
  const [agentProfile, setAgentProfile] = useState<AgentProfile>(INITIAL_PROFILE);
  const [originalPrompt, setOriginalPrompt] = useState(INITIAL_ORIGINAL_PROMPT);
  const [modifiedPrompt, setModifiedPrompt] = useState(INITIAL_MODIFIED_PROMPT);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const { toast } = useToast();
  
  const [workflowNodes, setWorkflowNodes] = useState<NodeState[]>(INITIAL_WORKFLOW_NODES);
  const [finalWorkflowResults, setFinalWorkflowResults] = useState<FinalWorkflowResults | null>(null);


  // Engine Tuning State
  const [baseRTR, setBaseRTR] = useState(65);
  const [pityBoonThreshold, setPityBoonThreshold] = useState(20);
  const [transmutationTithe, setTransmutationTithe] = useState(10);

  // Timeline State
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const timelineDuration = 90; // in seconds

  const [isSandboxMode, setIsSandboxMode] = useState(true);

  useEffect(() => {
    if (timelineProgress >= timelineDuration && timelineDuration > 0) {
      setIsFinished(true);
      setIsPlaying(false);
    } else {
      setIsFinished(false);
    }
  }, [timelineProgress, timelineDuration]);

  // This effect binds the workflow results to the timeline's progress.
  useEffect(() => {
    if (!finalWorkflowResults) return;

    // Update Analysis Node
    if (timelineProgress >= 30) {
      if (finalWorkflowResults.analysis) {
        setWorkflowNodes(prev => prev.map(n => n.id === 'analysis' ? { ...n, status: 'success', content: finalWorkflowResults.analysis!.analysis } : n));
      } else {
        setWorkflowNodes(prev => prev.map(n => n.id === 'analysis' ? { ...n, status: 'error', content: 'Analysis failed.' } : n));
      }
    }

    // Update Avatar Node
    if (timelineProgress >= 60) {
      if (finalWorkflowResults.avatar) {
        setWorkflowNodes(prev => prev.map(n => n.id === 'avatar' ? { ...n, status: 'success', content: finalWorkflowResults.avatar!.avatarDataUri } : n));
      } else {
        setWorkflowNodes(prev => prev.map(n => n.id === 'avatar' ? { ...n, status: 'error', content: 'Generation failed.' } : n));
      }
    }

    // Update Profile Node
    if (timelineProgress >= 90) {
      if (finalWorkflowResults.profile) {
        setWorkflowNodes(prev => prev.map(n => n.id === 'profile' ? { ...n, status: 'success', content: `Agent name set to "${finalWorkflowResults.profile!.name}". Profile updated.` } : n));
      } else {
        setWorkflowNodes(prev => prev.map(n => n.id === 'profile' ? { ...n, status: 'error', content: 'Profiling failed.' } : n));
      }
    }

  }, [timelineProgress, finalWorkflowResults]);


  const runSimulation = useCallback(async () => {
    setIsPlaying(true);
    setIsFinished(false);
    setTimelineProgress(0); // Start from beginning
    setFinalWorkflowResults(null);
    
    // Set all nodes to running state immediately
    setWorkflowNodes(prev => prev.map(node => ({ ...node, status: 'running', content: 'Processing...' })));
    
    // Trigger the prompt update automatically
    await handlePromptUpdate({ originalPrompt, modifiedPrompt });
  }, [originalPrompt, modifiedPrompt]);

  const resetSimulation = useCallback(() => {
    setIsPlaying(false);
    setIsFinished(false);
    setTimelineProgress(0);
    setWorkflowNodes(INITIAL_WORKFLOW_NODES);
    setFinalWorkflowResults(null);
  }, []);

  const play = useCallback(() => {
    if (!isFinished) {
      setIsPlaying(true);
    }
  }, [isFinished]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const rewind = useCallback(() => {
    setTimelineProgress(prev => Math.max(0, prev - 5));
  }, []);

  const fastForward = useCallback(() => {
    setTimelineProgress(prev => Math.min(timelineDuration, prev + 5));
  }, [timelineDuration]);

  const resetToInitialState = useCallback(() => {
    setIsProcessing(false);
    setAgentName(INITIAL_NAME);
    setAgentAvatar(INITIAL_AVATAR);
    setAgentProfile(INITIAL_PROFILE);
    setOriginalPrompt(INITIAL_ORIGINAL_PROMPT);
    setModifiedPrompt(INITIAL_MODIFIED_PROMPT);
    resetSimulation();
    toast({ title: "Workspace Cleared", description: "Ready to create a new agent." });
  }, [resetSimulation, toast]);

  const handlePromptUpdate = async (data: AnalyzePromptChangeInput): Promise<void> => {
    setIsProcessing(true);
    
    try {
      const results = await Promise.allSettled([
        analyzePromptChange(data),
        generateAgentAvatar({ prompt: data.modifiedPrompt }),
        analyzeAgentProfile({ prompt: data.modifiedPrompt })
      ]);
      
      const [analysisResult, avatarResult, profileResult] = results;

      const finalResults: FinalWorkflowResults = {
        analysis: null,
        avatar: null,
        profile: null,
      };

      if (analysisResult.status === 'fulfilled') {
        const { analysis } = analysisResult.value;
        finalResults.analysis = analysisResult.value;
      } else {
        console.error("Analysis failed:", analysisResult.reason);
        toast({ variant: 'destructive', title: 'Error', description: 'Behavioral analysis failed.' });
      }

      if (avatarResult.status === 'fulfilled') {
        const { avatarDataUri } = avatarResult.value;
        setAgentAvatar(avatarDataUri);
        finalResults.avatar = avatarResult.value;
      } else {
        console.error("Avatar generation failed:", avatarResult.reason);
        setAgentAvatar(INITIAL_AVATAR);
        toast({ variant: 'destructive', title: 'Error', description: 'Avatar generation failed.' });
      }

      if (profileResult.status === 'fulfilled') {
        const { name, profile } = profileResult.value;
        setAgentName(name);
        setAgentProfile(profile);
        finalResults.profile = profileResult.value;
      } else {
        console.error("Profile analysis failed:", profileResult.reason);
        setAgentName(INITIAL_NAME);
        setAgentProfile(INITIAL_PROFILE);
        toast({ variant: 'destructive', title: 'Error', description: 'Profile analysis failed.' });
      }
      
      setFinalWorkflowResults(finalResults);

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

    baseRTR,
    setBaseRTR,
    pityBoonThreshold,
    setPityBoonThreshold,
    transmutationTithe,
    setTransmutationTithe,

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
        <div className={cn(
          "bg-transparent text-foreground min-h-screen flex flex-col font-body transition-shadow duration-500",
          isSandboxMode && "sandbox-mode"
        )}>
            <div className="flex-1 flex flex-row overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 p-6 lg:p-8 flex flex-col gap-6 lg:gap-8 overflow-y-auto pt-24">
                        <div className='flex-1 flex flex-col gap-6 lg:gap-8'>
                          <ResonanceField title="Agent Workflow" color="purple">
                            <HallOfEchoes />
                          </ResonanceField>
                          <div className="flex-1 flex flex-col">
                              <IncantationEditor />
                          </div>
                        </div>
                    </main>
                    <EventTimeline />
                </div>
            </div>
        </div>
    </LoomContext.Provider>
  );
}

/**
 * Custom hook to consume the LoomContext.
 * Provides a convenient and type-safe way to access the application's global state.
 * This hook must be used within a component wrapped by the LoomProvider.
 * @returns {LoomContextType} The context value.
 * @throws {Error} If used outside of a LoomProvider.
 */
export const useLoom = (): LoomContextType => {
  const context = useContext(LoomContext);
  if (context === undefined) {
    throw new Error('useLoom must be used within a LoomProvider');
  }
  return context;
};
