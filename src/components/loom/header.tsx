
'use client';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { PersonaGallery } from './persona-gallery';


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
  const [isPersonaGalleryOpen, setIsPersonaGalleryOpen] = useState(false);

  const handleForgeClick = () => {
    if (prompt && !isForging) {
      onForge(prompt);
      setPrompt('');
      setIsPersonaGalleryOpen(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleForgeClick();
    }
  }

  const handlePersonaSelect = (personaPrompt: string) => {
    setPrompt(personaPrompt);
    // Directly call onForge after setting the prompt
    if (personaPrompt && !isForging) {
      onForge(personaPrompt);
      setPrompt('');
    }
    setIsPersonaGalleryOpen(false);
  }

  const handleOpenChange = (open: boolean) => {
    // Only open the popover if there is text in the input
    if (open && prompt.trim()) {
      setIsPersonaGalleryOpen(true);
    } else {
      setIsPersonaGalleryOpen(false);
    }
  };
  
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

       <Popover open={isPersonaGalleryOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 pointer-events-none" />
            <Input
              placeholder="Scribe an incantation or select a Persona..."
              className="w-full bg-background/50 rounded-full h-10 pl-12 pr-28 border-primary/30 focus-visible:ring-primary/80"
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value)
                if (e.target.value.trim()) {
                  setIsPersonaGalleryOpen(true)
                } else {
                  setIsPersonaGalleryOpen(false)
                }
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => { if(prompt.trim()) setIsPersonaGalleryOpen(true) }}
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
            className="w-[var(--radix-popover-trigger-width)] p-4"
            onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <PersonaGallery onSelectPersona={handlePersonaSelect} />
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-2 w-auto justify-end min-w-[100px]">
        {/* User Profile / Settings will go here. Empty div for spacing. */}
      </div>
    </header>
  );
}
