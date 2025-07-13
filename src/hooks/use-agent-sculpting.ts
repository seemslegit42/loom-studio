/**
 * @fileOverview This hook is now deprecated. Its logic has been simplified and moved
 * directly into the `SplitLayout` component to create a more direct and immediate
 * user experience for personality sculpting.
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
 * @deprecated This hook is no longer in use. The personality sculpting logic
 * has been integrated directly into the `SplitLayout` and `page` components.
 */
export function useAgentSculpting({ originalPrompt, profile, enabled }: UseAgentSculptingProps) {
    const [refinedPrompt, setRefinedPrompt] = useState<string | null>(null);
    const [isSculpting, setIsSculpting] = useState(false);
    
    // This hook is now a no-op but we retain the structure to avoid breaking imports
    // in a larger refactor. The functionality is disabled.
    
    useEffect(() => {
        if (isSculpting) setIsSculpting(false);
    }, [isSculpting]);

    return { refinedPrompt: null, isSculpting: false };
}
