import { PlusCircle, UploadCloud } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-border/50 px-6 lg:px-8 shrink-0">
      <div>
        <h1 className="text-2xl font-bold font-headline text-foreground">
          Good Afternoon, Commander
        </h1>
        <p className="text-muted-foreground">Here is the current state of your agentic systems.</p>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
          <UploadCloud className="mr-2 h-4 w-4" />
          Load Snapshot
        </Button>
        <Button className="bg-primary hover:bg-primary/90 glow-primary">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Agent
        </Button>
        <Avatar>
          <AvatarImage src="https://placehold.co/100x100.png" alt="Commander" data-ai-hint="person avatar" />
          <AvatarFallback>C</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
