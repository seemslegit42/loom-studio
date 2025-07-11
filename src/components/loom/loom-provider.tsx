
'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import Header from '@/components/loom/header';
import Sidebar from '@/components/loom/sidebar';
import IncantationEditor from '@/components/loom/incantation-editor';
import EventTimeline from '@/components/loom/event-timeline';

import { analyzePromptChange } from '@/ai/flows/analyze-prompt-change-flow';
import type { AnalyzePromptChangeInput, AnalyzePromptChangeOutput } from '@/ai/flows/analyze-prompt-change-schema';
import { generateAgentAvatar } from '@/ai/flows/generate-agent-avatar-flow';
import { analyzeAgentProfile, AnalyzeAgentProfileOutput } from '@/ai/flows/analyze-agent-profile-flow';
import { useSystemSigilState, Ritual, Variant } from '@/hooks/use-system-sigil-state';
import { useToast } from '@/hooks/use-toast';
import { SigilRites } from '../sigil-rites/SigilRites';
import { INITIAL_AVATAR, INITIAL_MODIFIED_PROMPT, INITIAL_NAME, INITIAL_ORIGINAL_PROMPT, INITIAL_PROFILE } from './loom-constants';

type AgentProfile = AnalyzeAgentProfileOutput['profile'];

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
  ritual: Ritual;
  variant: Variant;
  snapshots: Snapshot[];
  captureSnapshot: () => void;
  restoreSnapshot: (id: string) => void;
  deleteSnapshot: (id: string) => void;
  resetToInitialState: () => void;
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
  const { ritual, variant, setRitual, setVariant } = useSystemSigilState();
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const { toast } = useToast();

  const resetToInitialState = () => {
    setIsProcessing(false);
    setRitual('idle');
    setAgentName(INITIAL_NAME);
    setAgentAvatar(INITIAL_AVATAR);
    setAgentProfile(INITIAL_PROFILE);
    setOriginalPrompt(INITIAL_ORIGINAL_PROMPT);
    setModifiedPrompt(INITIAL_MODIFIED_PROMPT);
    toast({ title: "Workspace Cleared", description: "Ready to create a new agent." });
  };

  const handlePromptUpdate = async (data: AnalyzePromptChangeInput): Promise<void> => {
    setIsProcessing(true);
    setRitual('summon');

    try {
      const results = await Promise.allSettled([
        analyzePromptChange(data),
        generateAgentAvatar({ prompt: data.modifiedPrompt }),
        analyzeAgentProfile({ prompt: data.modifiedPrompt })
      ]);
      
      const [analysisResult, avatarResult, profileResult] = results;

      if (analysisResult.status === 'fulfilled') {
        toast({ title: 'Behavioral Analysis Complete', description: analysisResult.value.analysis });
      } else {
        console.error("Analysis failed:", analysisResult.reason);
        toast({ variant: 'destructive', title: 'Error', description: 'Behavioral analysis failed.' });
      }

      if (avatarResult.status === 'fulfilled') {
        setAgentAvatar(avatarResult.value.avatarDataUri);
      } else {
        console.error("Avatar generation failed:", avatarResult.reason);
        setAgentAvatar(INITIAL_AVATAR);
        toast({ variant: 'destructive', title: 'Error', description: 'Avatar generation failed.' });
      }

      if (profileResult.status === 'fulfilled') {
        setAgentName(profileResult.value.name);
        setAgentProfile(profileResult.value.profile);
      } else {
        console.error("Profile analysis failed:", profileResult.reason);
        setAgentName(INITIAL_NAME);
        setAgentProfile(INITIAL_PROFILE);
        toast({ variant: 'destructive', title: 'Error', description: 'Profile analysis failed.' });
      }

    } catch (error) {
      console.error("An error occurred during prompt update processing:", error);
      toast({ variant: 'destructive', title: 'System Error', description: 'A critical error occurred.' });
      setAgentAvatar(INITIAL_AVATAR);
      setAgentName(INITIAL_NAME);
      setAgentProfile(INITIAL_PROFILE);
    } finally {
      setIsProcessing(false);
      // The ritual state will be set back to 'idle' by the onRitualComplete callback in SigilRites
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
    ritual,
    variant,
    snapshots,
    captureSnapshot,
    restoreSnapshot,
    deleteSnapshot,
    resetToInitialState,
  };

  return (
    <LoomContext.Provider value={value}>
        <div className="bg-transparent text-foreground min-h-screen flex flex-col font-body">
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 p-6 lg:p-8 grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 overflow-y-auto">
                    <div className="flex items-center justify-center">
                      <SigilRites ritual={ritual} variant={variant} onRitualComplete={() => setRitual('idle')} />
                    </div>
                    <div className="xl:col-span-1">
                        <IncantationEditor />
                    </div>
                </main>
                </div>
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
