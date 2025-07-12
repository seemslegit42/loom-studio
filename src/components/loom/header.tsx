
'use client';
import { FilePlus2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ConfirmationDialog } from './confirmation-dialog';
import { Button } from '../ui/button';
import { useLoom } from './loom-provider';

/**
 * The main header component for Loom Studio, styled as a floating glassmorphic panel.
 * It provides the application logo and the BEEP™ Command Strip for primary navigation and control.
 * It also contains the "New Agent" action, protected by a confirmation dialog.
 * @returns {JSX.Element} The rendered header component.
 */
export default function Header() {
  const { resetToInitialState } = useLoom();

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl z-50">
        <div className="w-full h-16 p-4 rounded-full border border-primary/20 bg-card/50 backdrop-blur-lg flex items-center justify-between gap-4 shadow-lg shadow-primary/10">
            <div className="flex items-center gap-2 pl-2">
                <span className="font-headline text-lg tracking-widest text-primary">ΛΞVON</span>
            </div>
            
            <div className="flex-1 max-w-lg relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input 
                    placeholder="BEEP™ Command Strip: Forge your next command..."
                    className="w-full bg-background/50 rounded-full h-10 pl-12 pr-4 border-primary/30 focus-visible:ring-primary/80 glow-primary"
                />
            </div>

            <div>
                <ConfirmationDialog
                    title="Clear the Forge?"
                    description="This will reset the current agent's prompts, profile, and avatar to their initial state. This action cannot be undone."
                    actionLabel="Create New Agent"
                    onConfirm={resetToInitialState}
                >
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                        <FilePlus2 />
                    </Button>
                </ConfirmationDialog>
            </div>
        </div>
    </header>
  );
}
