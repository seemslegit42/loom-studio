'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import Header from '@/components/loom/header';
import Sidebar from '@/components/loom/sidebar';
import VisualWeaver from '@/components/loom/visual-weaver';
import IncantationEditor from '@/components/loom/incantation-editor';
import EventTimeline from '@/components/loom/event-timeline';

import { analyzePromptChange } from '@/ai/flows/analyze-prompt-change-flow';
import type { AnalyzePromptChangeInput, AnalyzePromptChangeOutput } from '@/ai/flows/analyze-prompt-change-schema';
import { generateAgentAvatar } from '@/ai/flows/generate-agent-avatar-flow';
import { analyzeAgentProfile, AnalyzeAgentProfileOutput } from '@/ai/flows/analyze-agent-profile-flow';
import { useSystemSigilState, Ritual, Variant } from '@/hooks/use-system-sigil-state';

type AgentProfile = AnalyzeAgentProfileOutput['profile'];

// Define the shape of the context
interface LoomContextType {
  isProcessing: boolean;
  agentName: string;
  agentAvatar: string;
  agentProfile: AgentProfile;
  handlePromptUpdate: (data: AnalyzePromptChangeInput) => Promise<AnalyzePromptChangeOutput>;
  ritual: Ritual;
  variant: Variant;
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

// Create the provider component
export default function LoomProvider({ children }: { children?: ReactNode }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentName, setAgentName] = useState(INITIAL_NAME);
  const [agentAvatar, setAgentAvatar] = useState(INITIAL_AVATAR);
  const [agentProfile, setAgentProfile] = useState<AgentProfile>(INITIAL_PROFILE);
  const { ritual, variant, setRitual, setVariant } = useSystemSigilState();

  const handlePromptUpdate = async (data: AnalyzePromptChangeInput): Promise<AnalyzePromptChangeOutput> => {
    setIsProcessing(true);
    setRitual('summon');
    try {
      // Kick off all AI calls in parallel
      const analysisPromise = analyzePromptChange(data);
      const avatarPromise = generateAgentAvatar({ prompt: data.modifiedPrompt });
      const profilePromise = analyzeAgentProfile({ prompt: data.modifiedPrompt });

      // Await all results
      const [analysisResult, avatarResult, profileResult] = await Promise.all([
        analysisPromise,
        avatarPromise,
        profilePromise
      ]);
      
      // Update state with the new results
      setAgentAvatar(avatarResult.avatarDataUri);
      setAgentName(profileResult.name);
      setAgentProfile(profileResult.profile);

      return analysisResult;
    } catch (error) {
      console.error("An error occurred during prompt update processing:", error);
      // Optionally reset to a safe state or show an error
      setAgentAvatar(INITIAL_AVATAR);
      setAgentName(INITIAL_NAME);
      setAgentProfile(INITIAL_PROFILE);
      throw error; // Re-throw to be caught by the calling component
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
  };

  return (
    <LoomContext.Provider value={value}>
        <div className="bg-transparent text-foreground min-h-screen flex flex-col font-body">
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 p-6 lg:p-8 grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 overflow-y-auto">
                    <div className="xl:col-span-2 flex flex-col gap-8">
                    <VisualWeaver />
                    </div>
                    <IncantationEditor />
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
