
'use client';

import { useLoom } from './loom-provider';
import { Textarea } from '../ui/textarea';
import { Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { ResonanceField } from './resonance-field';
import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * An interactive sandbox for crafting and analyzing agent prompts.
 * This component provides a dedicated space for prompt engineering, allowing architects
 * to see the immediate behavioral impact of their changes through real-time AI analysis.
 * It serves as the primary interface for defining an agent's "Profile (The Soul)".
 * @returns {JSX.Element} The rendered Prompt Sandbox component.
 */
export default function PromptSandbox() {
  const {
    originalPrompt,
    setOriginalPrompt,
    modifiedPrompt,
    setModifiedPrompt,
    analysisResult,
    isAnalyzing,
  } = useLoom();
  const [isModifiedPromptFocused, setIsModifiedPromptFocused] = useState(false);

  const showAnalysis = isAnalyzing || analysisResult;

  return (
    <ResonanceField title="The Incantation Chamber" color="green">
        <div className="flex flex-col md:flex-row gap-4 flex-1 h-full">
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="original-prompt" className="text-sm font-medium text-muted-foreground">Original Prompt (The Source)</label>
            <Textarea
              id="original-prompt"
              value={originalPrompt}
              onChange={(e) => setOriginalPrompt(e.target.value)}
              className="flex-1 bg-background/50 text-base resize-none"
              placeholder="Enter the base prompt..."
            />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="modified-prompt" className="text-sm font-medium text-muted-foreground">Modified Prompt (The Weave)</label>
            <Textarea
              id="modified-prompt"
              value={modifiedPrompt}
              onChange={(e) => setModifiedPrompt(e.target.value)}
              onFocus={() => setIsModifiedPromptFocused(true)}
              onBlur={() => setIsModifiedPromptFocused(false)}
              className={cn(
                "flex-1 bg-background/50 text-base border-primary/50 focus-visible:ring-primary/80 resize-none transition-all duration-300",
                isModifiedPromptFocused && "animate-pulse-glow-green"
              )}
              placeholder="Craft your new incantation..."
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-4 min-h-[76px]">
          {showAnalysis && (
            <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle className='font-headline text-accent'>Analysis</AlertTitle>
                <AlertDescription className='text-foreground'>
                    {isAnalyzing ? 'Thinking...' : analysisResult}
                </AlertDescription>
            </Alert>
          )}
        </div>
    </ResonanceField>
  );
}
