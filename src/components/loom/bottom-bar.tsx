
'use client';
import { Bot, History, Settings2, Shield, FilePlus2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "../ui/sheet";
import { Button } from "../ui/button";
import { AegisAnvilPanel, AgentDnaPanel, ChronoscopePanel, LoomOfFatesPanel } from "./instrument-panels";
import { ConfirmationDialog } from "./confirmation-dialog";
import { useLoom } from "./loom-provider";

const instruments = [
    { id: 'dna', title: 'Agent DNA', icon: Bot, panel: <AgentDnaPanel />, description: "View the agent's core identity and personality profile." },
    { id: 'chronoscope', title: 'The Chronoscope', icon: History, panel: <ChronoscopePanel />, description: "Capture and replay the agent's state to analyze behavior." },
    { id: 'loom', title: 'The Loom of Fates', icon: Settings2, panel: <LoomOfFatesPanel />, description: "Tune the Profit Dials of the KLEPSYDRA Engine." },
    { id: 'aegis', title: 'The Aegis Anvil', icon: Shield, panel: <AegisAnvilPanel />, description: "Forge automated SOAR playbooks to secure the system." },
];

/**
 * A bottom navigation bar for mobile viewports.
 * It provides access to the core instruments of Loom Studio via Sheet components,
 * offering a mobile-native and ergonomic user experience.
 * @returns {JSX.Element} The rendered bottom bar component.
 */
export default function BottomBar() {
    const { resetToInitialState } = useLoom();
    return (
        <footer className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/50 backdrop-blur-lg border-t-2 border-primary/20 z-50">
            <div className="flex justify-around items-center h-full">
                {instruments.map((instrument) => (
                    <Sheet key={instrument.id}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" className="flex flex-col h-full items-center justify-center text-muted-foreground p-2 gap-1">
                                <instrument.icon className="h-5 w-5" />
                                <span className="text-[10px]">{instrument.title.split(' ')[0]}</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="h-[85%] flex flex-col">
                            <SheetHeader>
                                <SheetTitle className="font-headline text-primary flex items-center gap-2 text-2xl">
                                    <instrument.icon className="h-6 w-6" />
                                    {instrument.title}
                                </SheetTitle>
                                <SheetDescription>{instrument.description}</SheetDescription>
                            </SheetHeader>
                            <div className="flex-1 overflow-y-auto p-4">
                                {instrument.panel}
                            </div>
                        </SheetContent>
                    </Sheet>
                ))}
                <ConfirmationDialog
                    title="Clear the Forge?"
                    description="This will reset the current agent's prompts, profile, and avatar to their initial state. This action cannot be undone."
                    actionLabel="Create New Agent"
                    onConfirm={resetToInitialState}
                >
                     <Button variant="ghost" className="flex flex-col h-full items-center justify-center text-muted-foreground p-2 gap-1">
                        <FilePlus2 className="h-5 w-5" />
                        <span className="text-[10px]">New</span>
                    </Button>
                </ConfirmationDialog>
            </div>
        </footer>
    );
}
