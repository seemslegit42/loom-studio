'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, RefreshCw, Wand2, Check } from "lucide-react";
import { AgentProfileChart } from "./agent-profile-chart";
import Image from 'next/image';
import { Skeleton } from "../ui/skeleton";
import { SigilRites } from "../sigil-rites/SigilRites";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { analyzeAgentProfile, type AnalyzeAgentProfileOutput } from "@/ai/flows/analyze-agent-profile-flow";
import { generateAgentAvatar } from "@/ai/flows/generate-agent-avatar-flow";

export type ForgeStep = 'inactive' | 'profiling' | 'reviewing' | 'generatingAvatar' | 'complete';
export type ForgeData = AnalyzeAgentProfileOutput & { prompt: string, avatarDataUri?: string };
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
  }, [isOpen, step, startAnalysis]);


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
    setStep('generatingAvatar');
    try {
      const avatarResult = await generateAgentAvatar({ prompt: data.prompt });
      setData(prev => prev ? { ...prev, avatarDataUri: avatarResult.avatarDataUri } : null);
      setStep('complete');
    } catch (error) {
      console.error("Avatar generation failed:", error);
      toast({
        variant: "destructive",
        title: "Visual Incoherence",
        description: "The agent's avatar could not be rendered. A default will be assigned.",
      });
       setData(prev => prev ? { ...prev, avatarDataUri: `https://placehold.co/96x96.png` } : null);
       setStep('complete');
    }
  };

  const handleRerollAvatar = async () => {
      if (!data) return;
      setStep('generatingAvatar');
      try {
          const avatarResult = await generateAgentAvatar({ prompt: data.prompt });
          setData(prev => prev ? { ...prev, avatarDataUri: avatarResult.avatarDataUri } : null);
          setStep('complete');
      } catch (error) {
          console.error("Avatar re-generation failed:", error);
          toast({
              variant: "destructive",
              title: "Visual Incoherence",
              description: "Could not render a new avatar. The previous form remains.",
          });
          setStep('complete');
      }
  };
  
  const handleFinalize = () => {
    if (data) {
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
              <DialogTitle className="text-center text-2xl font-headline">Ratify Agent Profile</DialogTitle>
            </DialogHeader>
            <div className="my-6">
                <AgentProfileChart profile={data.profile} agentName={data.name} />
            </div>
            <DialogFooter className="sm:justify-between gap-2">
                <Button variant="outline" onClick={handleRerollProfile}><RefreshCw className="mr-2" />Re-roll Profile</Button>
                <Button onClick={handleAcceptProfile} className="glow-primary"><Wand2 className="mr-2" />Accept & Forge Avatar</Button>
            </DialogFooter>
          </motion.div>
        );

      case 'generatingAvatar':
         return (
          <motion.div key="generating" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center text-center gap-4 h-64">
             <SigilRites variant="aegis" ritual="orchestrate" />
            <p className="text-muted-foreground">Rendering visual form... Binding essence to image...</p>
          </motion.div>
        );
      
      case 'complete':
        if (!data) return null;
        return (
             <motion.div key="complete" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-headline">Sanctify Agent Form</DialogTitle>
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
                </div>
                 <DialogFooter className="sm:justify-between gap-2">
                    <Button variant="outline" onClick={handleRerollAvatar}><RefreshCw className="mr-2" />Re-forge Avatar</Button>
                    <Button onClick={handleFinalize} className="glow-gilded"><Check className="mr-2" />Finalize & Summon</Button>
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
        <DialogClose onClick={onCancel} />
      </DialogContent>
    </Dialog>
  );
}
