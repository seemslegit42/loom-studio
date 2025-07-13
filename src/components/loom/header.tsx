
'use client';
import { Loader2, Search, Wand2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { usePromptAnalysis } from '@/hooks/use-prompt-analysis';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { AgentTaskConfig } from './agent-task-config';


interface HeaderProps {
  onForge: (prompt: string) => void;
  isForging: boolean;
}

/**
 * The main header component for Loom Studio.
 * It provides the application logo and the BEEP™ Command Strip for primary navigation and control.
 * @returns {JSX.Element} The rendered header component.
 */
export default function Header({ onForge, isForging }: HeaderProps) {
  const [prompt, setPrompt] = useState('');
  const { analysis, isLoading: isAnalyzing } = usePromptAnalysis(prompt);

  const handleForgeClick = () => {
    if (prompt && !isForging) {
      onForge(prompt);
      // We don't clear the prompt here anymore, the ForgeDialog will handle it.
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleForgeClick();
    }
  }
  
  const isPopoverOpen = !!prompt && (isAnalyzing || !!analysis);

  return (
    <header className="h-16 flex-shrink-0 px-4 md:px-6 flex items-center justify-between gap-4 border-b border-border/50 bg-card/50 backdrop-blur-lg z-50">
      <div className="flex items-center gap-2 w-auto">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8 text-primary">
            <path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8z"/>
            <path fill="currentColor" d="m12 13.41l-2.83-2.82l-1.41 1.41L12 16.24l4.24-4.24l-1.41-1.41L12 13.41z"/>
            <path fill="currentColor" d="M12 7.76L9.17 10.59l-1.41-1.41L12 5l4.24 4.24l-1.41 1.41L12 7.76z"/>
        </svg>
        <span className="font-headline text-lg tracking-widest text-primary">LOOM</span>
      </div>

       <Popover open={isPopoverOpen}>
        <PopoverTrigger asChild>
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 pointer-events-none" />
            <Input
              placeholder="Scribe an incantation to summon a new agent..."
              className="w-full bg-background/50 rounded-full h-10 pl-12 pr-28 border-primary/30 focus-visible:ring-primary/80"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isForging}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Button 
                    size="sm" 
                    className="rounded-full" 
                    onClick={handleForgeClick} 
                    disabled={isForging || !prompt.trim()}
                >
                  {isForging ? <Loader2 className="animate-spin" /> : 'Forge'}
                </Button>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent 
            className="w-[var(--radix-popover-trigger-width)] bg-card/80 backdrop-blur-lg border-primary/30"
            onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="min-h-[20px] text-sm">
            {isAnalyzing ? (
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

      <div className="flex items-center gap-2 w-auto justify-end min-w-[100px]">
        {/* User Profile / Settings will go here. Empty div for spacing. */}
      </div>
    </header>
  );
}
