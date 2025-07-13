
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from "lucide-react";
import { usePromptAnalysis } from "@/hooks/use-prompt-analysis";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";

interface AgentTaskConfigProps {
    initialPrompt: string;
    agentId: string;
    agentType: string;
    onUpdateNode: (agentId: string, newPrompt: string) => void;
}

/**
 * Configuration form for an existing Agent in the Inspector panel.
 * @returns {JSX.Element} The rendered form component.
 */
export function AgentTaskConfig({ initialPrompt, agentId, agentType, onUpdateNode }: AgentTaskConfigProps) {
    const [currentPromptValue, setCurrentPromptValue] = useState(initialPrompt);
    const [originalPrompt, setOriginalPrompt] = useState(initialPrompt);
    const [isUpdating, setIsUpdating] = useState(false);
    const { analysis, isLoading: isAnalyzing, resetAnalysis } = usePromptAnalysis(currentPromptValue, originalPrompt);

    useEffect(() => {
        setCurrentPromptValue(initialPrompt);
        setOriginalPrompt(initialPrompt);
        resetAnalysis();
    }, [initialPrompt, agentId, resetAnalysis]);

    const hasChanges = currentPromptValue !== originalPrompt;

    const handleUpdate = async () => {
        setIsUpdating(true);
        await onUpdateNode(agentId, currentPromptValue);
        
        // After successful update, the new prompt becomes the original prompt
        setOriginalPrompt(currentPromptValue);
        resetAnalysis();

        setIsUpdating(false);
    };

    const isLLMTaskAgent = agentType === 'LLM Task Agent';

    return (
        <div className="space-y-4">
             <div>
                <div className="flex justify-between items-center">
                    <Label htmlFor={`agent-prompt-${agentId}`} className="text-muted-foreground">Core Incantation (Prompt)</Label>
                    <Badge variant="secondary">{agentType}</Badge>
                </div>
                <Textarea 
                    id={`agent-prompt-${agentId}`}
                    placeholder="e.g., 'You are a master cybersecurity analyst...'"
                    className="mt-2 min-h-[200px] bg-background/50 border-border/70"
                    value={currentPromptValue}
                    onChange={(e) => setCurrentPromptValue(e.target.value)}
                    disabled={isUpdating}
                />
            </div>
            
            {isLLMTaskAgent && (
                <div className="min-h-[40px] p-3 rounded-md bg-background/30 border border-transparent">
                    {isAnalyzing ? (
                        <div className="space-y-2">
                        <Skeleton className="h-4 w-4/5" />
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
            )}

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
