
'use client';
import { Search, Wand2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { usePromptAnalysis } from '@/hooks/use-prompt-analysis';
import { useState } from 'react';
import { Skeleton } from '../ui/skeleton';

/**
 * The main header component for Loom Studio.
 * It provides the application logo and the BEEP™ Command Strip for primary navigation and control.
 * @returns {JSX.Element} The rendered header component.
 */
export default function Header() {
  const [prompt, setPrompt] = useState('');
  const { analysis, isLoading } = usePromptAnalysis(prompt);

  return (
    <header className="h-16 flex-shrink-0 px-4 md:px-6 flex items-center justify-between gap-4 border-b border-border/50 bg-card/50 backdrop-blur-lg z-50">
      <div className="flex items-center gap-2 w-[100px]">
        <span className="font-headline text-lg tracking-widest text-primary">ΛΞVON</span>
      </div>

      <Popover open={!!prompt && (isLoading || !!analysis)}>
        <PopoverTrigger asChild>
          <div className="flex-1 max-w-lg relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="BEEP: Scribe a new agent to analyze market sentiment..."
              className="w-full bg-background/50 rounded-full h-10 pl-12 pr-4 border-primary/30 focus-visible:ring-primary/80"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] bg-card/80 backdrop-blur-lg border-primary/30">
          <div className="min-h-[20px] text-sm">
            {isLoading ? (
               <div className="flex items-center gap-2 text-muted-foreground">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
            ) : analysis ? (
              <div className="flex items-start gap-2 text-accent">
                <Wand2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>{analysis}</p>
              </div>
            ) : null}
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-2 w-[100px] justify-end">
        {/* User Profile / Settings will go here. Empty div for spacing. */}
      </div>
    </header>
  );
}
