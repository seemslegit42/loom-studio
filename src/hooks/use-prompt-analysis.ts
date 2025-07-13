/**
 * @fileOverview A hook for debouncing and analyzing agent prompt changes.
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import { analyzePromptChange } from '@/ai/flows/analyze-prompt-change-flow';

const DEBOUNCE_DELAY = 750; // milliseconds

/**
 * A custom hook to analyze changes in a prompt in real-time with debouncing.
 * It calls the `analyzePromptChange` flow to get a summary of how changes
 * to a prompt will affect an agent's behavior.
 * 
 * @param {string} currentPrompt The current text of the prompt being edited.
 * @param {string} originalPrompt The original, saved text of the prompt.
 * @returns {{
 *  analysis: string | null;
 *  isLoading: boolean;
 *  resetAnalysis: () => void;
 * }} An object containing the analysis text, a loading state, and a reset function.
 */
export function usePromptAnalysis(currentPrompt: string, originalPrompt: string) {
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedPrompt] = useDebounce(currentPrompt, DEBOUNCE_DELAY);
    
    useEffect(() => {
        async function fetchAnalysis() {
            // Don't run analysis if the debounced prompt is the same as the original,
            // or if it's empty.
            if (debouncedPrompt === originalPrompt || !debouncedPrompt.trim()) {
                if (analysis) setAnalysis(null); // Clear previous analysis if text is reverted
                if (isLoading) setIsLoading(false);
                return;
            }
            
            setIsLoading(true);

            try {
                const result = await analyzePromptChange({
                    originalPrompt: originalPrompt,
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

    }, [debouncedPrompt, originalPrompt, analysis, isLoading]);
    
    const resetAnalysis = useCallback(() => {
        setAnalysis(null);
        setIsLoading(false);
    }, []);

    return { analysis, isLoading, resetAnalysis };
}
