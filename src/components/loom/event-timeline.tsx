'use client';

import { FastForward, Pause, Play, Rewind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';

export default function EventTimeline() {
  return (
    <footer className="border-t-2 border-primary/20 bg-card/20 backdrop-blur-lg">
      <Card className="bg-transparent border-0 rounded-none">
        <CardHeader className="p-4">
          <CardTitle className="text-sm font-headline tracking-wider">Event Debugging & Replay</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-accent">
              <Button variant="ghost" size="icon">
                <Rewind className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="bg-primary/20 text-primary-foreground rounded-full">
                <Play className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon">
                <Pause className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <FastForward className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 flex items-center gap-4">
                <span className="text-xs font-mono text-muted-foreground">0:00</span>
                <Slider defaultValue={[33]} max={100} step={1} />
                <span className="text-xs font-mono text-muted-foreground">1:30</span>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="flex items-center gap-3">
                <div className="text-center">
                    <p className="font-headline text-xs text-muted-foreground">BEEP™</p>
                    <p className="font-bold text-lg text-primary">ACTIVE</p>
                </div>
                <Button className="rounded-full animate-pulse-glow h-12 w-12 p-0">
                    <span className="font-headline">RUN</span>
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </footer>
  );
}
