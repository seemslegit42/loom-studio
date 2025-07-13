/**
 * @fileOverview A hook for debouncing and refining an agent's prompt based on personality sculpting.
 */
'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { refineAgentPrompt } from '@/ai/flows/refine-agent-prompt-flow';
import type { WorkflowNodeData } from '@/lib/types';
import { isEqual } from 'lodash';

const DEBOUNCE_DELAY = 1000; // milliseconds

interface UseAgentSculptingProps {
  originalPrompt: string;
  profile: WorkflowNodeData['profile'];
  enabled: boolean;
}

/**
 * A custom hook to handle the real-time refinement of an agent's prompt
 * when its personality profile is being "sculpted" by the user.
 * 
 * @param {UseAgentSculptingProps} props The properties for the hook.
 * @returns {{
 *  refinedPrompt: string | null;
 *  isSculpting: boolean;
 * }} An object containing the new prompt from the AI and a loading state.
 */
export function useAgentSculpting({ originalPrompt, profile, enabled }: UseAgentSculptingProps) {
    const [refinedPrompt, setRefinedPrompt] = useState<string | null>(null);
    const [isSculpting, setIsSculpting] = useState(false);
    const [debouncedProfile] = useDebounce(profile, DEBOUNCE_DELAY);
    const [initialProfile, setInitialProfile] = useState(profile);
    
    // Reset initial profile when the node changes
    useEffect(() => {
        setInitialProfile(profile);
    }, [profile]);
    
    useEffect(() => {
        if (!enabled) {
            if (isSculpting) setIsSculpting(false);
            return;
        }

        async function fetchRefinedPrompt() {
            // Don't run if the profile hasn't actually changed from its initial state
            if (isEqual(debouncedProfile, initialProfile)) {
                return;
            }

            setIsSculpting(true);
            setRefinedPrompt(null);
            
            try {
                const result = await refineAgentPrompt({
                    originalPrompt,
                    targetProfile: debouncedProfile,
                });
                setRefinedPrompt(result.refinedPrompt);
            } catch (error) {
                console.error("Failed to refine agent prompt:", error);
                // Handle error case, maybe with a toast notification in the component
            } finally {
                setIsSculpting(false);
                // Update the initial profile to the new debounced one to prevent re-triggering
                setInitialProfile(debouncedProfile);
            }
        }
        
        fetchRefinedPrompt();

    }, [debouncedProfile, originalPrompt, enabled, initialProfile]);
    
    return { refinedPrompt, isSculpting };
}
