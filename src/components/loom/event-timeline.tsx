
'use client';

import { FastForward, Pause, Play, Rewind, Rss, Square, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useLoom } from './loom-provider';
import { useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

export default function EventTimeline() {
  const {
    timelineProgress,
    setTimelineProgress,
    timelineDuration,
    isPlaying,
    isFinished,
    play,
    pause,
    rewind,
    fastForward,
    runSimulation,
    resetSimulation,
    isProcessing,
  } = useLoom();

  const requestRef = useRef<number>();

  const animate = useCallback((time: number) => {
    if (isPlaying) {
      setTimelineProgress(prev => {
        const newProgress = prev + (time - (requestRef.current || time)) / 1000;
        if (newProgress >= timelineDuration) {
          pause();
          return timelineDuration;
        }
        return newProgress;
      });
    }
    requestRef.current = time;
    if (!isFinished) {
      requestAnimationFrame(animate);
    }
  }, [isPlaying, isFinished, timelineDuration, setTimelineProgress, pause]);

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = performance.now();
      requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPlaying, animate]);


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.round((seconds - Math.floor(seconds)) * 100);
    return `${String(mins).padStart(1, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  };

  const isRunning = isPlaying && !isFinished;
  const isSimulationStarted = timelineProgress > 0 || isPlaying;

  const getStatus = () => {
    if (isFinished) return { text: "COMPLETED", className: "text-muted-foreground" };
    if (isRunning) return { text: "STREAMING", className: "text-accent animate-pulse" };
    return { text: "IDLE", className: "text-muted-foreground" };
  }
  const status = getStatus();

  if(isProcessing) return null;

  return (
    <footer className="border-t-2 border-primary/20 bg-card/50 backdrop-blur-lg shrink-0">
      <div className="px-6 py-3 flex items-center justify-between gap-6">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={rewind} disabled={!isSimulationStarted}>
              <Rewind className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="bg-primary/20 text-primary-foreground rounded-full h-10 w-10 hover:bg-primary/30 disabled:bg-muted disabled:text-muted-foreground"
              onClick={isPlaying ? pause : play}
              disabled={isFinished || !isSimulationStarted}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
             <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={fastForward} disabled={!isSimulationStarted}>
              <FastForward className="h-5 w-5" />
            </Button>
        </div>
        <div className="flex-1 flex items-center gap-4 max-w-xl">
            <span className="text-xs font-mono text-muted-foreground">{formatTime(timelineProgress)}</span>
            <Slider 
              value={[timelineProgress]}
              max={timelineDuration} 
              step={0.1}
              onValueChange={([value]) => setTimelineProgress(value)}
              disabled={!isSimulationStarted}
            />
            <span className="text-xs font-mono text-muted-foreground">{formatTime(timelineDuration)}</span>
        </div>
        <div className="flex items-center gap-6">
            <div className={cn("flex items-center gap-2", status.className)}>
                <Rss />
                <span className="font-mono text-sm">{status.text}</span>
            </div>
            {isFinished || timelineProgress >= timelineDuration ? (
              <Button onClick={resetSimulation} className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-full w-28 font-bold">
                  <History />
                  RESET
              </Button>
            ) : (
              <Button onClick={runSimulation} disabled={isPlaying} className="bg-gilded-accent text-black rounded-full w-28 font-bold glow-gilded disabled:bg-muted disabled:text-muted-foreground disabled:opacity-50 disabled:shadow-none">
                  <span className="font-headline">RUN</span>
              </Button>
            )}
        </div>
      </div>
    </footer>
  );
}
