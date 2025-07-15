
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "../ui/scroll-area";

const dials = [
    {
        key: 'baseRTR',
        name: 'Base RTR',
        description: 'Sets the baseline Retained Tribute Ratio, influencing the frequency of boon events vs. standard loss outcomes across all Folly Instruments.',
        defaultValue: 30,
    },
    {
        key: 'pityBoonThreshold',
        name: 'Pity Boon Threshold',
        description: 'The number of consecutive losses (Loss-Streak Elasticity) before the system guarantees a minor boon, preventing user despair.',
        defaultValue: 10,
    },
    {
        key: 'festivalTrigger',
        name: 'Festival Trigger',
        description: 'A global multiplier that can be activated to temporarily increase boon probabilities across the entire system, driving engagement.',
        defaultValue: 1,
    },
    {
        key: 'transmutationTithe',
        name: 'Transmutation Tithe',
        description: 'The percentage of value extracted from high-tier transmutations (e.g., in the Obelisk Marketplace) and redistributed to the system.',
        defaultValue: 5,
    }
]

export function LoomOfFatesPanel() {
    return (
        <ScrollArea className="h-full p-4">
            <div className="space-y-8">
                {dials.map((dial) => (
                    <Card key={dial.key} className="border-border/60 bg-card/40">
                        <CardHeader>
                            <CardTitle>{dial.name}</CardTitle>
                            <CardDescription>{dial.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="flex items-center gap-4">
                                <Slider
                                    id={`slider-${dial.key}`}
                                    defaultValue={[dial.defaultValue]}
                                    max={100}
                                    step={1}
                                    className="flex-1"
                                />
                                <div className="font-mono text-lg font-semibold w-16 text-right">
                                    {dial.defaultValue}%
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </ScrollArea>
    )
}
