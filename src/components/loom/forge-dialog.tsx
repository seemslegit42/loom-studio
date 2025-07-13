
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, RefreshCw, Wand2, Sparkles, Check } from "lucide-react";
import type { ForgeStep, ForgeData } from "@/app/page";
import { AgentProfileChart } from "./agent-profile-chart";
import Image from 'next/image';
import { Skeleton } from "../ui/skeleton";
import { SigilRites } from "../sigil-rites/SigilRites";

interface ForgeDialogProps {
  isOpen: boolean;
  step: ForgeStep;
  data: ForgeData | null;
  onAcceptProfile: () => void;
  onRerollProfile: () => void;
  onFinalize: () => void;
  onRerollAvatar: () => void;
  onCancel: () => void;
}

const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export function ForgeDialog({
  isOpen,
  step,
  data,
  onAcceptProfile,
  onRerollProfile,
  onFinalize,
  onRerollAvatar,
  onCancel,
}: ForgeDialogProps) {
  
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
                <Button variant="outline" onClick={onRerollProfile}><RefreshCw className="mr-2" />Re-roll Profile</Button>
                <Button onClick={onAcceptProfile} className="glow-primary"><Wand2 className="mr-2" />Accept & Forge Avatar</Button>
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
                    <Button variant="outline" onClick={onRerollAvatar}><RefreshCw className="mr-2" />Re-forge Avatar</Button>
                    <Button onClick={onFinalize} className="glow-gilded"><Check className="mr-2" />Finalize & Summon</Button>
                </DialogFooter>
             </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-2xl bg-card/80 backdrop-blur-lg border-primary/20">
        <AnimatePresence mode="wait">
            {renderContent()}
        </AnimatePresence>
        <DialogClose onClick={onCancel} />
      </DialogContent>
    </Dialog>
  );
}
