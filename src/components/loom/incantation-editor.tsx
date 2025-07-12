
'use client';
import { ArrowRight, LoaderCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLoom } from './loom-provider';
import type { AnalyzePromptChangeInput } from '@/ai/flows/analyze-prompt-change-schema';


/**
 * The Incantation Editor component provides a side-by-side view for editing and comparing
 * an "original" and a "modified" agent prompt. It allows the architect to submit these
 * prompts for analysis, which triggers the AI flows to diff the behaviors, generate a new
 * avatar, and create a new personality profile.
 * @returns {JSX.Element} The rendered incantation editor component.
 */
export default function IncantationEditor() {
  const { 
    isProcessing, 
    originalPrompt,
    modifiedPrompt,
    setOriginalPrompt,
    setModifiedPrompt,
  } = useLoom();

  return (
    <Card className="h-full flex flex-col bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/5">
      <CardHeader>
        <CardTitle className="font-headline text-primary flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          Incantation Editor
        </CardTitle>
        <CardDescription>
          Craft the agent's core identity. Press "RUN" on the timeline to see its effects.
        </CardDescription>
      </CardHeader>
      
        <div
          className="flex flex-col flex-1"
        >
          <CardContent className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2 h-full">
              <Label htmlFor="original-prompt" className="text-muted-foreground">
                Original Prompt
              </Label>
              <Textarea
                id="original-prompt"
                className="h-full bg-background/50 text-base flex-1 resize-none"
                value={originalPrompt}
                onChange={(e) => setOriginalPrompt(e.target.value)}
                disabled={isProcessing}
              />
            </div>
            <div className="grid gap-2 h-full">
              <Label htmlFor="modified-prompt" className="text-accent">
                Modified Prompt
              </Label>
              <Textarea
                id="modified-prompt"
                className="h-full bg-accent/5 border-accent/50 focus-visible:ring-accent text-base flex-1 resize-none"
                value={modifiedPrompt}
                onChange={(e) => setModifiedPrompt(e.target.value)}
                disabled={isProcessing}
              />
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground text-center w-full">
              The "RUN" command in the timeline will apply and analyze these changes.
            </p>
          </CardFooter>
        </div>
    </Card>
  );
}
