
import { PanelLeft, PanelRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BottomBarProps {
  onTogglePalette: () => void;
  onToggleInspector: () => void;
}

/**
 * A mobile-only bottom navigation bar for Loom Studio.
 * Provides access to the Palette and Inspector panels.
 * @returns {JSX.Element} The rendered bottom bar component.
 */
export default function BottomBar({ onTogglePalette, onToggleInspector }: BottomBarProps) {
  return (
    <footer className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-border/50 bg-background/80 backdrop-blur-lg z-50 flex items-center justify-around">
        <Button variant="ghost" size="lg" className="flex flex-col h-auto gap-1" onClick={onTogglePalette}>
            <PanelLeft />
            <span className="text-xs">Palette</span>
        </Button>
        <Button variant="ghost" size="lg" className="flex flex-col h-auto gap-1" onClick={onToggleInspector}>
            <PanelRight />
            <span className="text-xs">Inspector</span>
        </Button>
    </footer>
  );
}
