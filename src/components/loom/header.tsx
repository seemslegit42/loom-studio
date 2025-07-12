import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

/**
 * The main header component for Loom Studio.
 * It provides the application logo and the BEEP™ Command Strip for primary navigation and control.
 * @returns {JSX.Element} The rendered header component.
 */
export default function Header() {
  return (
    <header className="h-16 flex-shrink-0 px-4 md:px-6 flex items-center justify-between gap-4 border-b border-border/50 bg-card/50 backdrop-blur-lg z-50">
        <div className="flex items-center gap-2">
            <span className="font-headline text-lg tracking-widest text-primary">ΛΞVON</span>
        </div>
        
        <div className="flex-1 max-w-lg relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input 
                placeholder="BEEP, create a workflow for new employee onboarding..."
                className="w-full bg-background/50 rounded-full h-10 pl-12 pr-4 border-primary/30 focus-visible:ring-primary/80"
            />
        </div>

        <div>
            {/* User Profile / Settings will go here */}
        </div>
    </header>
  );
}
