
'use client';

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Info, Cpu, Play, Wand2 } from "lucide-react";
import { useState } from "react";
import { WorkflowNodePalette } from "./workflow-node-palette";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AgentTaskConfig } from "./agent-task-config";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import type { AnalyzeAgentProfileOutput } from "@/ai/flows/analyze-agent-profile-flow";
import { AgentProfileChart } from "./agent-profile-chart";
import { forgeAgentIdentity } from "@/ai/flows/forge-agent-identity-flow";
import { SigilRites, type Ritual, type Variant } from "../sigil-rites/SigilRites";
import { Skeleton } from "../ui/skeleton";
import BottomBar from "./bottom-bar";

interface SplitLayoutProps {
  variant: Variant;
  ritual: Ritual;
  setRitual: (ritual: Ritual) => void;
}

/**
 * The main three-panel layout for Loom Studio, featuring the Palette,
 * the central Canvas/Sigil, and the Inspector.
 * It is responsive, resizable, and manages the mobile sheet views.
 */
export default function SplitLayout({ variant, ritual, setRitual }: SplitLayoutProps) {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  const [isConfiguringAgent, setIsConfiguringAgent] = useState(false);
  const [agentName, setAgentName] = useState('New Agent');
  const [agentAvatar, setAgentAvatar] = useState<string | null>(null);
  const [agentProfile, setAgentProfile] = useState<AnalyzeAgentProfileOutput['profile'] | null>(null);
  const { toast } = useToast();

  const handleConfigureAgent = async (prompt: string) => {
    setIsConfiguringAgent(true);
    setAgentProfile(null);
    setRitual('orchestrate');
    try {
      const result = await forgeAgentIdentity({ prompt });

      if (result?.name) setAgentName(result.name);
      if (result?.profile) setAgentProfile(result.profile);
      if (result?.avatarDataUri) setAgentAvatar(result.avatarDataUri);
      
      toast({
        title: "Agent Forged",
        description: `New agent "${result.name}" has been configured.`,
      });

    } catch (error) {
      console.error("Agent configuration failed:", error);
      toast({
        variant: "destructive",
        title: "Error Forging Agent",
        description: "The agent's identity could not be forged. Please try again.",
      });
    } finally {
      setIsConfiguringAgent(false);
      setRitual('idle');
    }
  }

  const PalettePanel = () => (
    <div className="p-4 h-full flex flex-col">
      <h2 className="text-lg font-headline text-muted-foreground pb-4">Palette</h2>
      <WorkflowNodePalette />
    </div>
  );

  const InspectorPanel = () => (
    <div className="p-4 h-full flex flex-col">
       <h2 className="text-lg font-headline text-muted-foreground">Inspector</h2>
        <div className="flex-1 mt-4 space-y-6 overflow-y-auto pr-2">
          <AgentTaskConfig onConfigure={handleConfigureAgent} isConfiguring={isConfiguringAgent} />
          {isConfiguringAgent && !agentProfile && (
             <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                </CardContent>
             </Card>
          )}
          {agentProfile && (
              <AgentProfileChart profile={agentProfile} agentName={agentName} />
          )}
        </div>
    </div>
  );

  return (
    <>
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        {/* Palette Panel (Desktop) */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={25} className="h-full bg-card/30 border-r border-border/50 flex-col gap-4 hidden md:flex">
          <PalettePanel />
        </ResizablePanel>
        <ResizableHandle withHandle className="hidden md:flex" />
        <ResizablePanel defaultSize={60}>
          {/* Main Canvas Area */}
          <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-background relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
            <SigilRites variant={variant} ritual={ritual} onRitualComplete={() => setRitual('idle')} />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="hidden md:flex" />
        {/* Inspector Panel (Desktop) */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={25} className="h-full bg-card/30 border-l border-border/50 flex-col gap-4 hidden md:flex">
          <InspectorPanel />
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Mobile Bottom Bar controlled Sheets */}
      <BottomBar onTogglePalette={() => setIsPaletteOpen(p => !p)} onToggleInspector={() => setIsInspectorOpen(p => !p)} />

      {/* Palette Panel (Mobile) */}
      <Sheet open={isPaletteOpen} onOpenChange={setIsPaletteOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[340px] bg-card/80 backdrop-blur-lg flex flex-col">
          <PalettePanel />
        </SheetContent>
      </Sheet>

      {/* Inspector Panel (Mobile) */}
      <Sheet open={isInspectorOpen} onOpenChange={setIsInspectorOpen}>
        <SheetContent side="right" className="w-[300px] sm:w-[340px] bg-card/80 backdrop-blur-lg flex flex-col">
          <InspectorPanel />
        </SheetContent>
      </Sheet>
    </>
  );
}

// Dummy Card components for Skeleton to avoid prop drilling issues in this layout component
const Card = ({ children }: { children: React.ReactNode }) => <div className="rounded-lg border border-border/60 bg-card/40 text-card-foreground shadow-sm p-6">{children}</div>;
const CardHeader = ({ children }: { children: React.ReactNode }) => <div className="flex flex-col space-y-1.5 mb-4">{children}</div>;
const CardContent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
