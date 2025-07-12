
'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardHeader,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bot,
  TestTube2,
  Settings2,
  Shield,
  History,
  FilePlus2,
} from 'lucide-react';
import { LoomStudioLogo } from './logo';
import { AgentDnaPanel, ChronoscopePanel, AegisAnvilPanel, LoomOfFatesPanel } from './instrument-panels';
import { Button } from '../ui/button';
import { ConfirmationDialog } from './confirmation-dialog';
import { useLoom } from './loom-provider';

/**
 * The main sidebar component for Loom Studio, for desktop viewports.
 * It serves as the primary control panel, providing access to the core instruments:
 * Agent DNA Viewer, The Chronoscope (for snapshots), The Loom of Fates (engine tuning),
 * and The Aegis Anvil (security). On mobile, this is replaced by the BottomBar.
 * @returns {JSX.Element} The rendered sidebar component.
 */
export default function Sidebar() {
  const { resetToInitialState } = useLoom();

  return (
    <aside className="hidden lg:flex w-80 shrink-0 bg-card/30 border-r-2 border-gilded-accent/20 glow-gilded flex-col">
      <div className="h-20 flex items-center justify-between gap-3 px-6 border-b border-border/50">
        <div className='flex items-center gap-3'>
          <LoomStudioLogo className="h-10 w-10" />
          <h2 className="text-xl font-headline font-bold text-foreground">
            Loom Studio
          </h2>
        </div>
        <ConfirmationDialog
            title="Clear the Forge?"
            description="This will reset the current agent's prompts, profile, and avatar to their initial state. This action cannot be undone."
            actionLabel="Create New Agent"
            onConfirm={resetToInitialState}
        >
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <FilePlus2 />
            </Button>
        </ConfirmationDialog>
      </div>
      <ScrollArea className="flex-1">
        <Accordion
          type="single"
          defaultValue={'dna'}
          collapsible
          className="w-full"
        >
          <AccordionItem value="dna" className="border-b-0">
            <Card className="rounded-none border-0 border-b border-border/50 bg-transparent">
              <CardHeader className="p-0">
                <AccordionTrigger className="p-4 font-headline text-lg hover:no-underline flex items-center gap-2">
                  <Bot /> Agent DNA
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent className="p-4 pt-0 space-y-4">
                <AgentDnaPanel />
              </AccordionContent>
            </Card>
          </AccordionItem>

          <AccordionItem value="chronoscope" className="border-b-0">
            <Card className="rounded-none border-0 border-b border-border/50 bg-transparent">
              <CardHeader className="p-0">
                <AccordionTrigger className="p-4 font-headline text-lg hover:no-underline flex items-center gap-2">
                  <History /> The Chronoscope
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent className="p-4 pt-0 space-y-3">
                <ChronoscopePanel />
              </AccordionContent>
            </Card>
          </AccordionItem>
          
          <AccordionItem value="loom-of-fates" className="border-b-0">
            <Card className="rounded-none border-0 border-b border-border/50 bg-transparent">
              <CardHeader className="p-0">
                <AccordionTrigger className="p-4 font-headline text-lg hover:no-underline flex items-center gap-2">
                  <Settings2 /> The Loom of Fates
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent className="p-4 pt-0">
                <LoomOfFatesPanel />
              </AccordionContent>
            </Card>
          </AccordionItem>

          <AccordionItem value="aegis-anvil" className="border-b-0">
            <Card className="rounded-none border-0 bg-transparent">
              <CardHeader className="p-0">
                <AccordionTrigger className="p-4 font-headline text-lg hover:no-underline flex items-center gap-2">
                  <Shield /> The Aegis Anvil
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent className="p-4 pt-0 space-y-3">
                <AegisAnvilPanel />
              </AccordionContent>
            </Card>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </aside>
  );
}
