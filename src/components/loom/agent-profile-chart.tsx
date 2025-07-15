
'use client';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { WorkflowNodeData } from '@/lib/types';
import { useDebouncedCallback } from 'use-debounce';
import { GlassPane } from '../ui/glass-pane';

interface AgentProfileChartProps {
    profile: WorkflowNodeData['profile'];
    agentName: string;
    onProfileChange?: (newProfile: WorkflowNodeData['profile']) => void;
    isSculpting: boolean;
}

export function AgentProfileChart({ profile, agentName, onProfileChange, isSculpting }: AgentProfileChartProps) {
    const [localProfile, setLocalProfile] = useState(profile);

    useEffect(() => {
        // Update local state if the external profile changes (e.g., node selection changes)
        // but not while the user is actively sculpting.
        if (!isSculpting) {
            setLocalProfile(profile);
        }
    }, [profile, isSculpting]);

    const debouncedProfileChange = useDebouncedCallback((newProfile: WorkflowNodeData['profile']) => {
        if (onProfileChange) {
            onProfileChange(newProfile);
        }
    }, 500);


    const handleSliderChange = (traitName: string, newValue: number[]) => {
        const newProfile = localProfile.map(trait => 
            trait.trait === traitName ? { ...trait, value: newValue[0] } : trait
        );
        setLocalProfile(newProfile);
        debouncedProfileChange(newProfile);
    };

    const isInteractive = !!onProfileChange;

    return (
        <GlassPane>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Personality Matrix</CardTitle>
                        <CardDescription>
                            {isInteractive ? `Sculpt the soul of "${agentName}"` : `The soul of "${agentName}"`}
                        </CardDescription>
                    </div>
                    {isSculpting && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
                {localProfile.map((item) => (
                    <div key={item.trait} className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor={`slider-${item.trait}`} className="text-right text-muted-foreground col-span-1">
                            {item.trait}
                        </Label>
                        <Slider
                            id={`slider-${item.trait}`}
                            value={[item.value]}
                            max={100}
                            step={1}
                            onValueChange={(value) => handleSliderChange(item.trait, value)}
                            className="col-span-2"
                            disabled={!isInteractive || isSculpting}
                        />
                        <div className="col-span-1 text-right font-mono text-sm">
                            {item.value}
                        </div>
                    </div>
                ))}
            </CardContent>
        </GlassPane>
    );
}
