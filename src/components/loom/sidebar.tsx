'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BrainCircuit,
  Camera,
  DollarSign,
  KeyRound,
  ShieldCheck,
  Trash2,
  Microscope,
  Bot,
  TestTube2,
  Settings2,
} from 'lucide-react';
import { LoomStudioLogo } from './logo';
import { useLoom } from './loom-provider';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts';
import { ChartTooltipContent } from '../ui/chart';

const agentData = {
  certification: 'AIC Certified',
  dna: {
    coreCapabilities: [
      { id: 'reasoning', name: 'Advanced Reasoning', icon: BrainCircuit },
      { id: 'econ', name: 'Economic Analysis', icon: DollarSign },
      { id: 'search', name: 'Vector Search', icon: Microscope },
      { id: 'code', name: 'Code Generation', icon: Bot },
    ],
    permissions: [
      { id: 'billing', name: 'API Access: Billing', icon: KeyRound },
      { id: 'aegis', name: 'Aegis Control', icon: ShieldCheck },
    ],
  },
};

const snapshots = [
  { id: 'alpha', name: 'Alpha-Baseline', date: '2024-07-22 10:30 UTC' },
  { id: 'post_v2', name: 'Post-Finetune_v2', date: '2024-07-23 15:00 UTC' },
  { id: 'experiment_x', name: 'Experiment-X7', date: '2024-07-24 11:00 UTC' },
];

export default function Sidebar() {
  const { agentName, agentProfile } = useLoom();

  return (
    <aside className="w-80 shrink-0 bg-card/30 border-r-2 border-gilded-accent/20 glow-gilded flex flex-col">
      <div className="h-20 flex items-center gap-3 px-6 border-b border-border/50">
        <LoomStudioLogo className="h-10 w-10" />
        <h2 className="text-xl font-headline font-bold text-foreground">
          Loom Studio
        </h2>
      </div>
      <ScrollArea className="flex-1">
        <Accordion
          type="multiple"
          defaultValue={['dna', 'tuning', 'snapshots']}
          className="w-full"
        >
          <AccordionItem value="dna" className="border-b-0">
            <Card className="rounded-none border-0 border-b border-border/50 bg-transparent">
              <CardHeader className="p-0">
                <AccordionTrigger className="p-4 font-headline text-lg hover:no-underline">
                  Agent DNA
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent className="p-4 pt-0 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-lg flex items-center gap-2 font-semibold">
                    <Bot />
                    {agentName}
                  </div>
                  <Badge
                    variant="outline"
                    className="text-accent border-accent"
                  >
                    {agentData.certification}
                  </Badge>
                </div>

                <div className="w-full h-52">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={agentProfile} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                            <PolarGrid stroke="hsl(var(--border) / 0.5)" />
                            <PolarAngleAxis dataKey="trait" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                            <Radar name="Profile" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.4)" fillOpacity={0.6} />
                             <Tooltip content={<ChartTooltipContent />} cursor={{fill: 'hsl(var(--primary) / 0.1)'}}/>
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground">
                    Core Capabilities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {agentData.dna.coreCapabilities.map(cap => (
                      <Badge key={cap.id}>
                        <cap.icon className="w-3 h-3 mr-1.5" />
                        {cap.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground">
                    Permissions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {agentData.dna.permissions.map(perm => (
                      <Badge variant="secondary" key={perm.id}>
                        <perm.icon className="w-3 h-3 mr-1.5" />
                        {perm.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </Card>
          </AccordionItem>

          <AccordionItem value="tuning" className="border-b-0">
            <Card className="rounded-none border-0 border-b border-border/50 bg-transparent">
              <CardHeader className="p-0">
                <AccordionTrigger className="p-4 font-headline text-lg hover:no-underline flex items-center gap-2">
                  <Settings2 /> Engine Tuning
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent className="p-4 pt-0">
                <CardDescription className="mb-4">
                  Tune the KLEPSYDRA Engine's parameters.
                </CardDescription>
                <div className="space-y-6">
                  <div className="grid gap-2">
                    <Label htmlFor="creativity">Creativity</Label>
                    <Slider id="creativity" defaultValue={[65]} max={100} step={1} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="risk-aversion">Risk Aversion</Label>
                    <Slider id="risk-aversion" defaultValue={[20]} max={100} step={1} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="transmutation-tithe">Transmutation Tithe</Label>
                    <Slider id="transmutation-tithe" defaultValue={[10]} max={100} step={1} />
                  </div>
                </div>
              </AccordionContent>
            </Card>
          </AccordionItem>

          <AccordionItem value="snapshots" className="border-b-0">
            <Card className="rounded-none border-0 border-b border-border/50 bg-transparent">
              <CardHeader className="p-0">
                <AccordionTrigger className="p-4 font-headline text-lg hover:no-underline">
                  Behavioral Snapshots
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent className="p-4 pt-0 space-y-3">
                <Button variant="outline" className="w-full">
                  <Camera className="mr-2 h-4 w-4" />
                  Capture New Snapshot
                </Button>
                <div className="space-y-2">
                  {snapshots.map(snapshot => (
                    <div
                      key={snapshot.id}
                      className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div>
                        <p className="font-medium text-sm">{snapshot.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {snapshot.date}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </Card>
          </AccordionItem>
          <AccordionItem value="experiments" className="border-b-0">
            <Card className="rounded-none border-0 bg-transparent">
              <CardHeader className="p-0">
                <AccordionTrigger className="p-4 font-headline text-lg hover:no-underline">
                  Experiments
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent className="p-4 pt-0 space-y-3">
                <Button
                  variant="outline"
                  className="w-full border-accent/50 text-accent hover:bg-accent/20"
                >
                  <TestTube2 className="mr-2 h-4 w-4" />
                  Start New Experiment
                </Button>
              </AccordionContent>
            </Card>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </aside>
  );
}
