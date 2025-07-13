
'use client';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ArchetypeSelector } from './archetype-selector';
import type { CodexNode } from '@/lib/codex';

interface HeaderProps {
  onForge: (prompt: string) => void;
}

/**
 * The main header component for Loom Studio.
 * It provides the application logo and the main input for creating new agents.
 * @returns {JSX.Element} The rendered header component.
 */
export default function Header({ onForge }: HeaderProps) {
  const [prompt, setPrompt] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  const handleForgeClick = () => {
    if (prompt) {
      onForge(prompt);
      setPrompt('');
      setIsPopoverOpen(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleForgeClick();
    }
  }
  
  const handleArchetypeSelect = (archetype: CodexNode) => {
    setPrompt(`A ${archetype.name} agent that `);
    setIsPopoverOpen(false);
    // Focus the input field after selection
    document.getElementById('incantation-input')?.focus();
  }

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

       <div className="flex-1 max-w-xl relative">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 pointer-events-none" />
              <Input
                id="incantation-input"
                placeholder="Scribe an incantation to forge an agent or an entire workflow..."
                className="w-full bg-background/50 rounded-full h-10 pl-12 pr-28 border-primary/30 focus-visible:ring-primary/80"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => { if(prompt.trim() === '') setIsPopoverOpen(true) }}
                autoComplete="off"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] max-w-xl p-0 border-primary/30" align="start">
              <ArchetypeSelector onSelect={handleArchetypeSelect} />
          </PopoverContent>
        </Popover>
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Button 
                size="sm" 
                className="rounded-full" 
                onClick={handleForgeClick} 
                disabled={!prompt.trim()}
            >
              {'Forge'}
            </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 w-auto justify-end min-w-[100px]">
        {/* User Profile / Settings will go here. Empty div for spacing. */}
      </div>
    </header>
  );
}
