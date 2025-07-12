
'use client';
import { useLoom } from "./loom-provider";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
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
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '../ui/chart';
import { formatDistanceToNow } from 'date-fns';
import { ConfirmationDialog } from './confirmation-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

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

const chartConfig = {
  value: {
    label: 'Value',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

/**
 * A panel displaying the agent's core identity and personality profile.
 */
export function AgentDnaPanel() {
  const { agentName, agentProfile } = useLoom();
  
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="text-lg flex items-center gap-2 font-semibold">
          {agentName}
        </div>
        <Badge variant="outline" className="text-accent border-accent">
          {agentData.certification}
        </Badge>
      </div>

      <ChartContainer config={chartConfig} className="w-full h-52">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={agentProfile} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: 'hsl(var(--primary) / 0.1)' }} />
            <PolarGrid stroke="hsl(var(--border) / 0.5)" />
            <PolarAngleAxis dataKey="trait" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            <Radar name="Profile" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.4)" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </ChartContainer>

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
    </>
  );
}

/**
 * A panel for capturing and replaying behavioral snapshots of the agent.
 */
export function ChronoscopePanel() {
  const { snapshots, captureSnapshot, restoreSnapshot, deleteSnapshot } = useLoom();

  return (
    <>
      <CardDescription className="mb-4">
        Capture and replay the agent's state to analyze behavior.
      </CardDescription>
      <Button variant="outline" className="w-full" onClick={captureSnapshot}>
        <Camera className="mr-2 h-4 w-4" />
        Capture Behavioral Snapshot
      </Button>
      <div className="space-y-2 pt-2">
        {snapshots.length === 0 && (
          <p className="text-xs text-muted-foreground text-center p-4">No snapshots captured.</p>
        )}
        {snapshots.map(snapshot => (
          <div
            key={snapshot.id}
            className="flex items-center justify-between p-2 rounded-md bg-muted/50 group"
          >
            <button className="text-left flex-1" onClick={() => restoreSnapshot(snapshot.id)}>
              <p className="font-medium text-sm group-hover:text-primary transition-colors">{snapshot.agentName}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(snapshot.capturedAt, { addSuffix: true })}
              </p>
            </button>
            <ConfirmationDialog
              title="Delete Snapshot?"
              description={`Are you sure you want to delete the snapshot for "${snapshot.agentName}"? This action cannot be undone.`}
              onConfirm={() => deleteSnapshot(snapshot.id)}
              actionLabel="Delete"
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </ConfirmationDialog>
          </div>
        ))}
      </div>
    </>
  );
}

/**
 * A panel for tuning the economic dials of the KLEPSYDRA Engine.
 */
export function LoomOfFatesPanel() {
    const { 
        baseRTR,
        setBaseRTR,
        pityBoonThreshold,
        setPityBoonThreshold,
        transmutationTithe,
        setTransmutationTithe 
    } = useLoom();
  return (
    <>
      <CardDescription className="mb-4">
        Tune the Profit Dials of the KLEPSYDRA Engine.
      </CardDescription>
      <TooltipProvider>
        <div className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="base-rtr">Base RTR</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Slider id="base-rtr" value={[baseRTR]} onValueChange={([val]) => setBaseRTR(val)} max={100} step={1} />
              </TooltipTrigger>
              <TooltipContent>
                <p>{baseRTR}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pity-boon">Pity Boon Threshold</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Slider id="pity-boon" value={[pityBoonThreshold]} onValueChange={([val]) => setPityBoonThreshold(val)} max={100} step={1} />
              </TooltipTrigger>
              <TooltipContent>
                <p>{pityBoonThreshold}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="transmutation-tithe">Transmutation Tithe</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Slider id="transmutation-tithe" value={[transmutationTithe]} onValueChange={([val]) => setTransmutationTithe(val)} max={100} step={1} />
              </TooltipTrigger>
              <TooltipContent>
                <p>{transmutationTithe}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
}

/**
 * A panel for designing automated security playbooks.
 */
export function AegisAnvilPanel() {
  return (
    <>
      <CardDescription className="mb-4">
        Forge automated SOAR playbooks to secure the system.
      </CardDescription>
      <Button
        variant="outline"
        className="w-full border-accent/50 text-accent hover:bg-accent/20"
      >
        <TestTube2 className="mr-2 h-4 w-4" />
        Design New Playbook
      </Button>
    </>
  );
}
