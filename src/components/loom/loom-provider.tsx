'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import Header from '@/components/loom/header';
import Sidebar from '@/components/loom/sidebar';
import VisualWeaver, { WorkflowState } from '@/components/loom/visual-weaver';
import IncantationEditor from '@/components/loom/incantation-editor';
import EventTimeline from '@/components/loom/event-timeline';

import { analyzePromptChange } from '@/ai/flows/analyze-prompt-change-flow';
import type { AnalyzePromptChangeInput, AnalyzePromptChangeOutput } from '@/ai/flows/analyze-prompt-change-schema';
import { generateAgentAvatar } from '@/ai/flows/generate-agent-avatar-flow';
import { analyzeAgentProfile, AnalyzeAgentProfileOutput } from '@/ai/flows/analyze-agent-profile-flow';
import { useSystemSigilState, Ritual, Variant } from '@/hooks/use-system-sigil-state';
import { toast } from '@/hooks/use-toast';

type AgentProfile = AnalyzeAgentProfileOutput['profile'];

// Define the shape of the context
interface LoomContextType {
  isProcessing: boolean;
  agentName: string;
  agentAvatar: string;
  agentProfile: AgentProfile;
  handlePromptUpdate: (data: AnalyzePromptChangeInput) => Promise<void>;
  ritual: Ritual;
  variant: Variant;
  workflowState: WorkflowState;
}

// Create the context with a default value
const LoomContext = createContext<LoomContextType | undefined>(undefined);

// Initial state values
const INITIAL_AVATAR = 'https://placehold.co/100x100.png';
const INITIAL_NAME = 'Prometheus-7';
const INITIAL_PROFILE: AgentProfile = [
  { "trait": "Creativity", "value": 50 },
  { "trait": "Humor", "value": 50 },
  { "trait": "Formality", "value": 50 },
  { "trait": "Enthusiasm", "value": 50 },
  { "trait": "Technicality", "value": 50 },
  { "trait": "Whimsy", "value": 50 }
];

const INITIAL_WORKFLOW_STATE: WorkflowState = {
    analysis: { title: 'Analyze Behavior', status: 'idle', content: null },
    avatar: { title: 'Generate Avatar', status: 'idle', content: null },
    profile: { title: 'Profile Personality', status: 'idle', content: null },
};


// Create the provider component
export default function LoomProvider({ children }: { children?: ReactNode }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentName, setAgentName] = useState(INITIAL_NAME);
  const [agentAvatar, setAgentAvatar] = useState(INITIAL_AVATAR);
  const [agentProfile, setAgentProfile] = useState<AgentProfile>(INITIAL_PROFILE);
  const [workflowState, setWorkflowState] = useState<WorkflowState>(INITIAL_WORKFLOW_STATE);
  const { ritual, variant, setRitual, setVariant } = useSystemSigilState();

  const handlePromptUpdate = async (data: AnalyzePromptChangeInput): Promise<void> => {
    setIsProcessing(true);
    setRitual('summon');
    setWorkflowState({
        analysis: { ...INITIAL_WORKFLOW_STATE.analysis, status: 'running' },
        avatar: { ...INITIAL_WORKFLOW_STATE.avatar, status: 'running' },
        profile: { ...INITIAL_WORKFLOW_STATE.profile, status: 'running' },
    });

    try {
      const results = await Promise.allSettled([
        analyzePromptChange(data),
        generateAgentAvatar({ prompt: data.modifiedPrompt }),
        analyzeAgentProfile({ prompt: data.modifiedPrompt })
      ]);
      
      const [analysisResult, avatarResult, profileResult] = results;

      if (analysisResult.status === 'fulfilled') {
        toast({ title: 'Behavioral Analysis Complete', description: analysisResult.value.analysis });
        setWorkflowState(prev => ({ ...prev, analysis: { ...prev.analysis, status: 'success', content: analysisResult.value.analysis }}));
      } else {
        console.error("Analysis failed:", analysisResult.reason);
        setWorkflowState(prev => ({ ...prev, analysis: { ...prev.analysis, status: 'error', content: 'Analysis failed' }}));
      }

      if (avatarResult.status === 'fulfilled') {
        setAgentAvatar(avatarResult.value.avatarDataUri);
        setWorkflowState(prev => ({ ...prev, avatar: { ...prev.avatar, status: 'success', content: avatarResult.value.avatarDataUri }}));
      } else {
        console.error("Avatar generation failed:", avatarResult.reason);
        setWorkflowState(prev => ({ ...prev, avatar: { ...prev.avatar, status: 'error', content: 'Avatar generation failed' }}));
      }

      if (profileResult.status === 'fulfilled') {
        setAgentName(profileResult.value.name);
        setAgentProfile(profileResult.value.profile);
        setWorkflowState(prev => ({ ...prev, profile: { ...prev.profile, status: 'success', content: `${profileResult.value.name} profile updated` }}));
      } else {
        console.error("Profile analysis failed:", profileResult.reason);
        setWorkflowState(prev => ({ ...prev, profile: { ...prev.profile, status: 'error', content: 'Profile analysis failed' }}));
      }

    } catch (error) {
      console.error("An error occurred during prompt update processing:", error);
      toast({ variant: 'destructive', title: 'System Error', description: 'A critical error occurred.' });
      setWorkflowState({
        analysis: { ...INITIAL_WORKFLOW_STATE.analysis, status: 'error', content: 'System Error' },
        avatar: { ...INITIAL_WORKFLOW_STATE.avatar, status: 'error', content: 'System Error' },
        profile: { ...INITIAL_WORKFLOW_STATE.profile, status: 'error', content: 'System Error' },
      });
      // Optionally reset to a safe state
      setAgentAvatar(INITIAL_AVATAR);
      setAgentName(INITIAL_NAME);
      setAgentProfile(INITIAL_PROFILE);
    } finally {
      setIsProcessing(false);
      setRitual('idle');
    }
  };

  const value = {
    isProcessing,
    agentName,
    agentAvatar,
    agentProfile,
    handlePromptUpdate,
    ritual,
    variant,
    workflowState,
  };

  return (
    <LoomContext.Provider value={value}>
        <div className="bg-transparent text-foreground min-h-screen flex flex-col font-body">
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 p-6 lg:p-8 grid grid-cols-1 xl:grid-cols-5 gap-6 lg:gap-8 overflow-y-auto">
                    <div className="xl:col-span-3 flex flex-col gap-8">
                    <VisualWeaver />
                    </div>
                    <div className="xl:col-span-2">
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
