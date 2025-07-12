
'use client';

import { useLoom } from './loom-provider';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Sparkles, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

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

  const showAnalysis = isAnalyzing || analysisResult;

  return (
    <Card className="h-full flex flex-col bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/5">
      <CardHeader>
        <CardTitle className="font-headline text-primary flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          Prompt Injection Sandbox
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          <div className="flex flex-col gap-2">
            <label htmlFor="original-prompt" className="text-sm font-medium text-muted-foreground">Original Prompt (The Base)</label>
            <Textarea
              id="original-prompt"
              value={originalPrompt}
              onChange={(e) => setOriginalPrompt(e.target.value)}
              className="flex-1 bg-background/50 text-base"
              placeholder="Enter the base prompt..."
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="modified-prompt" className="text-sm font-medium text-muted-foreground">Modified Prompt (The Incantation)</label>
            <Textarea
              id="modified-prompt"
              value={modifiedPrompt}
              onChange={(e) => setModifiedPrompt(e.target.value)}
              className="flex-1 bg-background/50 text-base border-primary/50 focus-visible:ring-primary/80"
              placeholder="Craft your new incantation..."
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 min-h-[76px]">
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
      </CardContent>
    </Card>
  );
}
