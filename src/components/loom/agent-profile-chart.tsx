
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { AnalyzeAgentProfileOutput } from '@/ai/flows/analyze-agent-profile-schema';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { WorkflowNodeData } from '@/lib/types';

interface AgentProfileChartProps {
    profile: WorkflowNodeData['profile'];
    agentName: string;
    onProfileChange?: (newProfile: WorkflowNodeData['profile']) => void;
    isSculpting: boolean;
}

export function AgentProfileChart({ profile, agentName, onProfileChange, isSculpting }: AgentProfileChartProps) {
    const [localProfile, setLocalProfile] = useState(profile);

    useEffect(() => {
        setLocalProfile(profile);
    }, [profile]);

    const handleSliderChange = (traitName: string, newValue: number[]) => {
        const newProfile = localProfile.map(trait => 
            trait.trait === traitName ? { ...trait, value: newValue[0] } : trait
        );
        setLocalProfile(newProfile);
    };

    const handleSliderCommit = (newValues: number[]) => {
        if (!onProfileChange) return;
        // Find which trait changed to get the full profile object.
        // This is a bit of a workaround because onValueCommit only gives us the number.
        // It assumes only one slider moves at a time which is a safe assumption.
        const changedTrait = localProfile.find(p => p.value !== profile.find(op => op.trait === p.trait)?.value);
        if (changedTrait) {
            const finalProfile = profile.map(p => p.trait === changedTrait.trait ? { ...p, value: newValues[0] } : p);
            onProfileChange(finalProfile);
        }
    };

    const isInteractive = !!onProfileChange;
    

    return (
        <Card className="border-border/60 bg-card/40">
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
                            onValueCommit={handleSliderCommit}
                            className="col-span-2"
                            disabled={!isInteractive || isSculpting}
                        />
                        <div className="col-span-1 text-right font-mono text-sm">
                            {item.value}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
