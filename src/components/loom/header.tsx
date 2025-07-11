
'use client';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Header() {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl z-50">
        <div className="w-full h-16 p-4 rounded-full border border-primary/20 bg-card/50 backdrop-blur-lg flex items-center justify-between gap-4 shadow-lg shadow-primary/10">
            <div className="flex items-center gap-2 pl-2">
                <span className="font-headline text-lg tracking-widest text-primary">ΛΞVON</span>
            </div>
            
            <div className="flex-1 max-w-lg relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                    placeholder="BEEP™ Command Strip // Forge your next command..."
                    className="w-full bg-background/50 rounded-full h-10 pl-12 pr-4 border-primary/30 focus-visible:ring-primary/80 glow-primary"
                />
            </div>

            <div>
                {/* Reserved for future contextual instruments */}
            </div>
        </div>
    </header>
  );
}
