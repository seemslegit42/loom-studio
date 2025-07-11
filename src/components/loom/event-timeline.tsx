'use client';

import { FastForward, Pause, Play, Rewind, Rss } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export default function EventTimeline() {
  return (
    <footer className="border-t-2 border-primary/20 bg-card/50 backdrop-blur-lg shrink-0">
      <div className="px-6 py-3 flex items-center justify-between gap-6">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Rewind className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="bg-primary/20 text-primary-foreground rounded-full h-10 w-10">
              <Play className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Pause className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <FastForward className="h-5 w-5" />
            </Button>
        </div>
        <div className="flex-1 flex items-center gap-4 max-w-xl">
            <span className="text-xs font-mono text-muted-foreground">0:00.12</span>
            <Slider defaultValue={[33]} max={100} step={1} />
            <span className="text-xs font-mono text-muted-foreground">1:30.56</span>
        </div>
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-accent">
                <Rss className="animate-pulse" />
                <span className="font-mono text-sm">STREAMING</span>
            </div>
            <Button className="bg-gilded-accent text-black rounded-full w-28 font-bold glow-gilded">
                <span className="font-headline">RUN</span>
            </Button>
        </div>
      </div>
    </footer>
  );
}
