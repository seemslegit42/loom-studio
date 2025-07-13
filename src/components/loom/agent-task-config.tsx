
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from "lucide-react";
import { usePromptAnalysis } from "@/hooks/use-prompt-analysis";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface AgentTaskConfigProps {
    initialPrompt: string;
    agentId: string;
}

/**
 * Configuration form for an existing Agent in the Inspector panel.
 * @returns {JSX.Element} The rendered form component.
 */
export function AgentTaskConfig({ initialPrompt, agentId }: AgentTaskConfigProps) {
    const [prompt, setPrompt] = useState(initialPrompt);
    const [isUpdating, setIsUpdating] = useState(false);
    const { analysis, isLoading: isAnalyzing } = usePromptAnalysis(prompt);
    const { toast } = useToast();

    // Reset prompt when selected agent changes
    useEffect(() => {
        setPrompt(initialPrompt);
    }, [initialPrompt, agentId]);


    const hasChanges = prompt !== initialPrompt;

    const handleUpdate = async () => {
        setIsUpdating(true);
        // In a real app, you would call an update function here, e.g.:
        // await updateAgent({ agentId, prompt });
        console.log(`Updating agent ${agentId} with prompt:`, prompt);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast({
            title: "Agent Updated",
            description: "The agent's incantation has been successfully refined.",
        });
        
        // This would likely trigger a state update in the parent component
        // to reflect the new prompt in the main state. For now, we just
        // show a toast.
        
        setIsUpdating(false);
    };

    return (
        <div className="space-y-4">
             <div>
                <Label htmlFor={`agent-prompt-${agentId}`} className="text-muted-foreground">Core Incantation (Prompt)</Label>
                <Textarea 
                    id={`agent-prompt-${agentId}`}
                    placeholder="e.g., 'You are a master cybersecurity analyst...'"
                    className="mt-2 min-h-[200px] bg-background/50 border-border/70"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isUpdating}
                />
            </div>
            
            <div className="min-h-[40px] p-3 rounded-md bg-background/30 border border-transparent">
                {isAnalyzing ? (
                    <div className="space-y-2">
                       <Skeleton className="h-4 w-4/5" />
                       <Skeleton className="h-4 w-3/5" />
                    </div>
                ) : analysis ? (
                    <div className="flex items-start gap-2 text-sm text-accent">
                        <Wand2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <p>{analysis}</p>
                    </div>
                ): (
                    <div className="text-sm text-muted-foreground/60 italic">
                        AI-driven analysis will appear here as you edit...
                    </div>
                )}
            </div>

            <Button className="w-full" onClick={handleUpdate} disabled={isUpdating || !hasChanges}>
                {isUpdating ? (
                    <>
                        <Loader2 className="animate-spin" />
                        Refining...
                    </>
                ) : (
                    "Update Incantation"
                )}
            </Button>
        </div>
    );
}
