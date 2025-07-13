
'use client';

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, RefreshCw, Wand2, Check, Fingerprint, Palette, X } from "lucide-react";
import { AgentProfileChart } from "./agent-profile-chart";
import Image from 'next/image';
import { Skeleton } from "../ui/skeleton";
import { SigilRites } from "../sigil-rites/SigilRites";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { analyzeAgentProfile, type AnalyzeAgentProfileOutput } from "@/ai/flows/analyze-agent-profile-flow";
import { generateAgentAvatar } from "@/ai/flows/generate-agent-avatar-flow";
import { signAvatarData } from "@/ai/flows/sign-avatar-data-flow";
import crypto from 'crypto';
import { Badge } from "../ui/badge";
import type { PrimeArsenalStyle, ArsenalStyle } from "@/lib/styles";
import { StyleSelector } from "./style-selector";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";


export type ForgeStep = 'inactive' | 'profiling' | 'generatingAvatar' | 'signing' | 'complete';
export type ForgeData = AnalyzeAgentProfileOutput & { prompt: string, avatarDataUri?: string, signature?: string, selectedStyle: PrimeArsenalStyle };
export type ForgedAgent = ForgeData;

interface GenesisChamberProps {
  prompt: string;
  onFinalize: (agentData: ForgedAgent) => void;
  onCancel: () => void;
}

const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export function GenesisChamber({
  prompt,
  onFinalize,
  onCancel,
}: GenesisChamberProps) {
  const [step, setStep] = useState<ForgeStep>('inactive');
  const [data, setData] = useState<ForgeData | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isStylePopoverOpen, setIsStylePopoverOpen] = useState(false);
  const { toast } = useToast();

  const startAnalysis = useCallback(async (p: string) => {
    if (!p.trim()) return;
    setData(null);
    setStep('profiling');

    try {
      const profileResult = await analyzeAgentProfile({ prompt: p });
      const forgeData: ForgeData = { 
        ...profileResult, 
        prompt: p,
        selectedStyle: profileResult.recommendedStyle,
      };
      setData(forgeData);
      await generateAvatar(forgeData);
    } catch (error) {
      console.error("Agent profiling failed:", error);
      toast({
        variant: "destructive",
        title: "Aetheric Interference",
        description: "The agent's personality could not be analyzed. Please check the incantation.",
      });
      onCancel();
    }
  }, [toast, onCancel]);

  useEffect(() => {
    if (prompt) {
      startAnalysis(prompt);
    } else {
      setStep('inactive');
      setData(null);
      setIsFinalizing(false);
    }
  }, [prompt, startAnalysis]);

  const generateSignature = useCallback(async (currentData: ForgeData) => {
    if (!currentData.avatarDataUri) return;
    setStep('signing');

    try {
      const personalityProfileHash = crypto
        .createHash('sha256')
        .update(JSON.stringify(currentData.profile))
        .digest('hex');

      const signatureResult = await signAvatarData({
          agentId: `agent_${Date.now()}`,
          timestamp: Date.now(),
          architectUid: 'arch_001',
          avatarDataUri: currentData.avatarDataUri,
          personalityProfileHash,
      });

      setData(prev => prev ? { ...prev, signature: signatureResult.signature } : null);
      setStep('complete');
    } catch (error) {
      console.error("Avatar signing failed:", error);
      toast({
          variant: "destructive",
          title: "Signature Rejected",
          description: "The avatar's authenticity could not be sealed. The form is unverified.",
      });
      setData(prev => prev ? { ...prev, signature: 'unsigned' } : null);
      setStep('complete');
    }
  }, [toast]);
  
  const generateAvatar = useCallback(async (currentData: ForgeData) => {
    setStep('generatingAvatar');
    try {
      const avatarResult = await generateAgentAvatar({ 
        prompt: currentData.prompt, 
        profile: currentData.profile,
        selectedStyle: currentData.selectedStyle,
      });
      const newData = { ...currentData, avatarDataUri: avatarResult.avatarDataUri };
      setData(newData);
      await generateSignature(newData);
    } catch (error) {
       console.error("Avatar generation failed:", error);
       toast({
         variant: "destructive",
         title: "Visual Incoherence",
         description: "The agent's avatar could not be rendered. A default will be assigned.",
       });
        const newData = { ...data, avatarDataUri: `https://placehold.co/96x96.png` };
        setData(newData);
        if(data) await generateSignature(newData);
    }
  }, [toast, data, generateSignature]);

  const handleRerollAvatar = async () => {
      if (!data) return;
      await generateAvatar(data);
  };

  const handleSelectStyleAndReforge = async (style: ArsenalStyle) => {
    if (!data) return;
    setIsStylePopoverOpen(false);
    const newData = { ...data, selectedStyle: style.name };
    setData(newData);
    await generateAvatar(newData);
  }
  
  const handleFinalize = () => {
    if (data && !isFinalizing) {
        setIsFinalizing(true);
        onFinalize(data);
    }
  };

  const renderContent = () => {
    const renderStep = (icon: React.ReactNode, text: string) => (
         <div className="flex flex-col items-center justify-center text-center gap-4 py-12">
            {icon}
            <p className="text-muted-foreground">{text}</p>
        </div>
    );

    switch (step) {
      case 'profiling':
        return renderStep(<SigilRites variant="klepsydra" ritual="orchestrate" />, "Analyzing incantation... Forging personality matrix...");
      case 'generatingAvatar':
        return renderStep(<SigilRites variant="aegis" ritual="orchestrate" />, "Rendering visual form based on AI analysis...");
      case 'signing':
        return renderStep(<SigilRites variant="genesis" ritual="transmute" />, "Sealing avatar with cryptographic signature...");
      case 'complete':
        if (!data) return null;
        return (
             <motion.div key="complete" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <Card className="border-border/60 bg-card/40 text-center">
                   <CardHeader>
                        <CardTitle className="text-xl font-headline">{data.name}</CardTitle>
                        <CardDescription>Sanctify Manifested Form</CardDescription>
                   </CardHeader>
                   <CardContent className="flex flex-col items-center gap-4">
                        <div className="relative w-28 h-28 rounded-full border-2 border-primary/50 glow-primary">
                            {data.avatarDataUri ? (
                                <Image 
                                    src={data.avatarDataUri} 
                                    alt={`${data.name} Avatar`}
                                    layout="fill"
                                    className="rounded-full object-cover"
                                />
                            ) : (
                                <Skeleton className="w-full h-full rounded-full" />
                            )}
                        </div>
                        {data.signature && (
                            <div className="flex flex-col items-center gap-1.5 text-center">
                                <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs border-gilded-accent/30 text-gilded-accent/90">
                                <Fingerprint className="h-3 w-3" />
                                Sanctification Seal
                                </Badge>
                                <p className="text-xs text-muted-foreground font-mono break-all max-w-full px-2">{data.signature}</p>
                            </div>
                        )}
                   </CardContent>
                </Card>
                <AgentProfileChart profile={data.profile} agentName={data.name} />

                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={handleRerollAvatar} disabled={isFinalizing}><RefreshCw className="mr-2" />Re-forge</Button>
                        <Popover open={isStylePopoverOpen} onOpenChange={setIsStylePopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="flex-1" disabled={isFinalizing}><Palette className="mr-2" />Style</Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <StyleSelector onSelectStyle={handleSelectStyleAndReforge} />
                            </PopoverContent>
                        </Popover>
                    </div>
                     <Button onClick={handleFinalize} className="w-full glow-gilded" disabled={isFinalizing}>
                        {isFinalizing ? (
                          <>
                            <Loader2 className="animate-spin" />
                            Summoning...
                          </>
                        ) : (
                          <>
                            <Check className="mr-2" />
                            Finalize & Summon
                          </>
                        )}
                    </Button>
                     <Button variant="ghost" size="sm" className="w-full" onClick={onCancel}>
                        <X className="mr-2" />
                        Cancel
                    </Button>
                </div>
             </motion.div>
        );

      default:
        return <div className="h-96" />;
    }
  };

  return (
    <AnimatePresence mode="wait">
        {renderContent()}
    </AnimatePresence>
  );
}
