/**
 * @fileOverview A hook for debouncing and analyzing agent prompt changes.
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { analyzePromptChange } from '@/ai/flows/analyze-prompt-change-flow';

const DEBOUNCE_DELAY = 750; // milliseconds

/**
 * A custom hook to analyze changes in a prompt in real-time with debouncing.
 * It calls the `analyzePromptChange` flow to get a summary of how changes
 * to a prompt will affect an agent's behavior.
 * 
 * @param {string} currentPrompt The current text of the prompt being edited.
 * @returns {{
 *  analysis: string | null;
 *  isLoading: boolean;
 * }} An object containing the analysis text and a loading state.
 */
export function usePromptAnalysis(currentPrompt: string) {
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedPrompt] = useDebounce(currentPrompt, DEBOUNCE_DELAY);
    const originalPromptRef = useRef(currentPrompt);
    
    // Set the initial prompt once when the component mounts
    useEffect(() => {
        originalPromptRef.current = currentPrompt;
    }, []);

    useEffect(() => {
        async function fetchAnalysis() {
            // Don't run on the initial render or if the prompt is empty
            if (debouncedPrompt === originalPromptRef.current || !debouncedPrompt) {
                setAnalysis(null);
                return;
            }
            
            setIsLoading(true);
            setAnalysis(null);

            try {
                const result = await analyzePromptChange({
                    originalPrompt: originalPromptRef.current,
                    modifiedPrompt: debouncedPrompt,
                });
                setAnalysis(result.analysis);
            } catch (error) {
                console.error("Failed to analyze prompt change:", error);
                setAnalysis("Could not analyze the change.");
            } finally {
                setIsLoading(false);
            }
        }
        
        fetchAnalysis();

    }, [debouncedPrompt]);

    // When the analysis is done and new debounced prompt becomes the original
    useEffect(() => {
      if (!isLoading && analysis) {
        originalPromptRef.current = debouncedPrompt;
      }
    }, [isLoading, analysis, debouncedPrompt])

    return { analysis, isLoading };
}
