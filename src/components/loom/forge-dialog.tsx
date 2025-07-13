
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, RefreshCw, Wand2, Check, Fingerprint } from "lucide-react";
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


export type ForgeStep = 'inactive' | 'profiling' | 'reviewing' | 'selectingStyle' | 'generatingAvatar' | 'signing' | 'complete';
export type ForgeData = AnalyzeAgentProfileOutput & { prompt: string, avatarDataUri?: string, signature?: string, selectedStyle?: PrimeArsenalStyle };
export type ForgedAgent = ForgeData;

interface ForgeDialogProps {
  isOpen: boolean;
  prompt: string;
  onFinalize: (agentData: ForgedAgent) => void;
  onCancel: () => void;
}

const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export function ForgeDialog({
  isOpen,
  prompt,
  onFinalize,
  onCancel,
}: ForgeDialogProps) {
  const [step, setStep] = useState<ForgeStep>('inactive');
  const [data, setData] = useState<ForgeData | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const { toast } = useToast();

  const startAnalysis = useCallback(async () => {
    if (!prompt.trim()) return;

    setStep('profiling');

    try {
      const profileResult = await analyzeAgentProfile({ prompt });
      setData({ ...profileResult, prompt });
      setStep('reviewing');
    } catch (error) {
      console.error("Agent profiling failed:", error);
      toast({
        variant: "destructive",
        title: "Aetheric Interference",
        description: "The agent's personality could not be analyzed. Please check the incantation.",
      });
      onCancel(); // Close dialog on failure
    }
  }, [prompt, toast, onCancel]);

  useEffect(() => {
    if (isOpen && step === 'inactive') {
      startAnalysis();
    }
    if (!isOpen) {
      // Reset state when dialog closes
      setStep('inactive');
      setData(null);
      setIsFinalizing(false);
    }
  }, [isOpen, step, startAnalysis]);

  const generateSignature = useCallback(async (currentData: ForgeData) => {
    if (!currentData.avatarDataUri) return;
    setStep('signing');

    try {
      const personalityProfileHash = crypto
        .createHash('sha256')
        .update(JSON.stringify(currentData.profile))
        .digest('hex');

      const signatureResult = await signAvatarData({
          agentId: `agent_${Date.now()}`, // Placeholder ID
          timestamp: Date.now(),
          architectUid: 'arch_001', // Placeholder UID
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


  const handleRerollProfile = async () => {
    if (!data) return;
    setStep('profiling');
    try {
        const profileResult = await analyzeAgentProfile({ prompt: data.prompt });
        setData({ ...profileResult, prompt: data.prompt });
        setStep('reviewing');
    } catch (error) {
        console.error("Agent re-profiling failed:", error);
        toast({
            variant: "destructive",
            title: "Aetheric Interference",
            description: "Failed to forge a new profile. The spirits are restless.",
        });
        setStep('reviewing'); // Go back to reviewing previous state
    }
  };
  
  const handleAcceptProfile = async () => {
    if (!data) return;
    setStep('selectingStyle');
  };

  const handleSelectStyle = async (style: ArsenalStyle) => {
    if (!data) return;
    const newData = { ...data, selectedStyle: style.name };
    setData(newData);
    await generateAvatar(newData);
  }

  const handleRerollAvatar = async () => {
      if (!data) return;
      await generateAvatar(data);
  };
  
  const handleFinalize = () => {
    if (data && !isFinalizing) {
        setIsFinalizing(true);
        onFinalize(data);
    }
  };

  const renderContent = () => {
    switch (step) {
      case 'profiling':
        return (
          <motion.div key="profiling" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center text-center gap-4 h-64">
             <SigilRites variant="klepsydra" ritual="orchestrate" />
            <p className="text-muted-foreground">Analyzing incantation... Forging personality matrix...</p>
          </motion.div>
        );

      case 'reviewing':
        if (!data) return null;
        return (
          <motion.div key="reviewing" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-headline">Ratify Profile Matrix</DialogTitle>
            </DialogHeader>
            <div className="my-6">
                <AgentProfileChart profile={data.profile} agentName={data.name} />
            </div>
            <DialogFooter className="sm:justify-between gap-2">
                <Button variant="outline" onClick={handleRerollProfile}><RefreshCw className="mr-2" />Re-roll Profile</Button>
                <Button onClick={handleAcceptProfile} className="glow-primary"><Wand2 className="mr-2" />Accept & Select Style</Button>
            </DialogFooter>
          </motion.div>
        );
      
      case 'selectingStyle':
        return (
            <motion.div key="selectingStyle" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-headline">Stylistic Invocation</DialogTitle>
                </DialogHeader>
                <div className="my-6">
                    <StyleSelector onSelectStyle={handleSelectStyle} />
                </div>
            </motion.div>
        );

      case 'generatingAvatar':
         return (
          <motion.div key="generating" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center text-center gap-4 h-64">
             <SigilRites variant="aegis" ritual="orchestrate" />
            <p className="text-muted-foreground">Rendering visual form... Binding essence to image...</p>
          </motion.div>
        );

      case 'signing':
        return (
          <motion.div key="signing" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center text-center gap-4 h-64">
            <SigilRites variant="genesis" ritual="transmute" />
            <p className="text-muted-foreground">Sealing avatar with cryptographic signature...</p>
          </motion.div>
        );
      
      case 'complete':
        if (!data) return null;
        return (
             <motion.div key="complete" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-headline">Sanctify Manifested Form</DialogTitle>
                </DialogHeader>
                <div className="my-6 flex flex-col items-center gap-6">
                    <div className="relative w-48 h-48 rounded-full border-2 border-primary/50 glow-primary">
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
                    <h3 className="text-xl font-semibold text-foreground">{data.name}</h3>

                    {data.signature && (
                      <div className="flex flex-col items-center gap-2 text-center">
                        <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs border-gilded-accent/30 text-gilded-accent/90">
                          <Fingerprint className="h-3 w-3" />
                          Sanctification Seal
                        </Badge>
                        <p className="text-xs text-muted-foreground font-mono break-all max-w-full">{data.signature}</p>
                      </div>
                    )}
                </div>
                 <DialogFooter className="sm:justify-between gap-2">
                    <Button variant="outline" onClick={handleRerollAvatar} disabled={isFinalizing}><RefreshCw className="mr-2" />Re-forge Avatar</Button>
                    <Button onClick={handleFinalize} className="glow-gilded" disabled={isFinalizing}>
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
                </DialogFooter>
             </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-2xl">
        <AnimatePresence mode="wait">
            {renderContent()}
        </AnimatePresence>
        <DialogClose asChild>
            <button className="hidden" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
