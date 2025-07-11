
'use client';

import { FastForward, Pause, Play, Rewind, Rss, Square, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useLoom } from './loom-provider';
import { useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

/**
 * Represents the Event Timeline and transport controls for the simulation.
 * It provides functionality to play, pause, rewind, fast-forward, and scrub through
 * the agent workflow execution timeline. It also displays the current status and time.
 * @returns {JSX.Element} The rendered event timeline component.
 */
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
  const lastTimeRef = useRef<number>(0);

  /**
   * The main animation loop for the timeline, driven by `requestAnimationFrame`.
   * It updates the timeline progress smoothly when in a playing state.
   */
  const animate = useCallback((time: number) => {
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = time;
    }
    const deltaTime = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;

    if (isPlaying) {
      setTimelineProgress(prev => {
        const newProgress = prev + deltaTime;
        if (newProgress >= timelineDuration) {
          pause();
          return timelineDuration;
        }
        return newProgress;
      });
    }
    requestRef.current = requestAnimationFrame(animate);
  }, [isPlaying, timelineDuration, setTimelineProgress, pause]);

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(animate);
    } else {
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
            requestRef.current = undefined;
        }
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPlaying, animate]);


  /**
   * Formats a given number of seconds into a MM:SS string.
   * @param {number} seconds - The time in seconds.
   * @returns {string} The formatted time string.
   */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  
  /**
   * Handles changes from the timeline slider, updating the progress and pausing playback.
   * @param {number[]} value - The new value from the slider, as an array.
   */
  const handleSliderChange = (value: number[]) => {
      setTimelineProgress(value[0]);
      if (isPlaying) {
          pause();
      }
  }

  const isRunning = isPlaying && !isFinished;
  const isSimulationStarted = timelineProgress > 0 || isPlaying || isFinished;

  /**
   * Determines the current status text and styling for the timeline display.
   * @returns {{ text: string, className: string }} The status text and associated CSS class.
   */
  const getStatus = () => {
    if (isFinished || timelineProgress >= timelineDuration) return { text: "COMPLETED", className: "text-muted-foreground" };
    if (isRunning) return { text: "STREAMING", className: "text-accent animate-pulse" };
    if (isSimulationStarted && !isPlaying) return { text: "PAUSED", className: "text-muted-foreground" };
    return { text: "IDLE", className: "text-muted-foreground" };
  }
  const status = getStatus();

  return (
    <footer className="border-t-2 border-primary/20 bg-card/50 backdrop-blur-lg shrink-0">
      <div className="px-6 py-3 flex items-center justify-between gap-6">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={rewind} disabled={!isSimulationStarted || isProcessing}>
              <Rewind className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="bg-primary/20 text-primary-foreground rounded-full h-10 w-10 hover:bg-primary/30 disabled:bg-muted disabled:text-muted-foreground"
              onClick={isPlaying ? pause : play}
              disabled={isFinished || !isSimulationStarted || isProcessing || timelineProgress >= timelineDuration}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
             <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={fastForward} disabled={!isSimulationStarted || isProcessing}>
              <FastForward className="h-5 w-5" />
            </Button>
        </div>
        <div className="flex-1 flex items-center gap-4 max-w-xl">
            <span className="text-xs font-mono text-muted-foreground">{formatTime(timelineProgress)}</span>
            <Slider 
              value={[timelineProgress]}
              max={timelineDuration} 
              step={0.1}
              onValueChange={handleSliderChange}
              disabled={!isSimulationStarted || isProcessing}
            />
            <span className="text-xs font-mono text-muted-foreground">{formatTime(timelineDuration)}</span>
        </div>
        <div className="flex items-center gap-6">
            <div className={cn("flex items-center gap-2", status.className)}>
                <Rss />
                <span className="font-mono text-sm">{status.text}</span>
            </div>
            {isFinished || timelineProgress >= timelineDuration ? (
              <Button onClick={resetSimulation} className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-full w-28 font-bold flex items-center gap-2">
                  <History className="w-4 h-4" />
                  RESET
              </Button>
            ) : (
              <Button onClick={runSimulation} disabled={isPlaying || isProcessing || isSimulationStarted} className="bg-gilded-accent text-black rounded-full w-28 font-bold glow-gilded disabled:bg-muted disabled:text-muted-foreground disabled:opacity-50 disabled:shadow-none">
                  <span className="font-headline">RUN</span>
              </Button>
            )}
        </div>
      </div>
    </footer>
  );
}
