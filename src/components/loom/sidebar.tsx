'use client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { BrainCircuit, Camera, ChevronDown, DollarSign, KeyRound, ShieldCheck, Trash2 } from "lucide-react";
import { LoomStudioLogo } from "./logo";

export default function Sidebar() {
  return (
    <aside className="w-80 shrink-0 bg-card/30 border-r-2 border-[hsl(var(--gilded-accent))] shadow-[5px_0px_30px_hsl(var(--gilded-accent)/0.2)] flex flex-col">
      <div className="h-20 flex items-center gap-3 px-6 border-b border-border/50">
        <LoomStudioLogo className="h-10 w-10"/>
        <h2 className="text-xl font-headline font-bold text-foreground">Loom Studio</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <Accordion type="multiple" defaultValue={['fates', 'dna']} className="w-full">
            <AccordionItem value="fates" className="border-b-0">
                <Card className="rounded-none border-0 border-b border-border/50 bg-transparent">
                    <CardHeader className="p-0">
                        <AccordionTrigger className="p-4 font-headline text-lg hover:no-underline">The Loom of Fates</AccordionTrigger>
                    </CardHeader>
                    <AccordionContent className="p-4 pt-0">
                        <CardDescription className="mb-4">Tune the KLEPSYDRA Engine's Profit Dials.</CardDescription>
                        <div className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="base-rtr">Base RTR</Label>
                                <Slider id="base-rtr" defaultValue={[25]} max={100} step={1} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="pity-boon">Pity Boon Threshold</Label>
                                <Slider id="pity-boon" defaultValue={[50]} max={100} step={1} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="transmutation-tithe">Transmutation Tithe</Label>
                                <Slider id="transmutation-tithe" defaultValue={[10]} max={100} step={1} />
                            </div>
                        </div>
                    </AccordionContent>
                </Card>
            </AccordionItem>
          
            <AccordionItem value="dna" className="border-b-0">
                <Card className="rounded-none border-0 border-b border-border/50 bg-transparent">
                    <CardHeader className="p-0">
                        <AccordionTrigger className="p-4 font-headline text-lg hover:no-underline">Agent DNA Viewer</AccordionTrigger>
                    </CardHeader>
                    <AccordionContent className="p-4 pt-0 space-y-4">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-base">Agent: Prometheus-7</CardTitle>
                            <Badge variant="outline" className="text-accent border-accent">AIC Certified</Badge>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm text-muted-foreground">Core Capabilities</h4>
                            <div className="flex flex-wrap gap-2">
                                <Badge><BrainCircuit className="w-3 h-3 mr-1"/> Advanced Reasoning</Badge>
                                <Badge><DollarSign className="w-3 h-3 mr-1"/> Economic Analysis</Badge>
                                <Badge>Vector Search</Badge>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm text-muted-foreground">Permissions</h4>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary"><KeyRound className="w-3 h-3 mr-1"/> API Access: Billing</Badge>
                                <Badge variant="secondary"><ShieldCheck className="w-3 h-3 mr-1"/> Aegis Control</Badge>
                            </div>
                        </div>
                    </AccordionContent>
                </Card>
            </AccordionItem>

            <AccordionItem value="snapshots" className="border-b-0">
                <Card className="rounded-none border-0 border-b border-border/50 bg-transparent">
                    <CardHeader className="p-0">
                        <AccordionTrigger className="p-4 font-headline text-lg hover:no-underline">Behavioral Snapshots</AccordionTrigger>
                    </CardHeader>
                    <AccordionContent className="p-4 pt-0 space-y-3">
                        <Button variant="outline" className="w-full">
                            <Camera className="mr-2 h-4 w-4" />
                            Capture New Snapshot
                        </Button>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                <div>
                                    <p className="font-medium">Alpha-Baseline</p>
                                    <p className="text-xs text-muted-foreground">2024-07-22 10:30 UTC</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                <div>
                                    <p className="font-medium">Post-Finetune_v2</p>
                                    <p className="text-xs text-muted-foreground">2024-07-23 15:00 UTC</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </AccordionContent>
                </Card>
            </AccordionItem>
        </Accordion>
      </div>
    </aside>
  );
}
