
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from "lucide-react";
import { usePromptAnalysis } from "@/hooks/use-prompt-analysis";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import type { WorkflowNodeData } from "@/lib/types";

interface AgentTaskConfigProps {
    node: WorkflowNodeData;
    onUpdateNode: (agentId: string, newPrompt: string) => void;
    isSculpting: boolean;
}

/**
 * Configuration form for an existing Agent in the Inspector panel.
 * @returns {JSX.Element} The rendered form component.
 */
export function AgentTaskConfig({ node, onUpdateNode, isSculpting }: AgentTaskConfigProps) {
    const [currentPromptValue, setCurrentPromptValue] = useState(node.prompt);
    const [originalPrompt, setOriginalPrompt] = useState(node.prompt);
    
    const { analysis, isLoading: isAnalyzing, resetAnalysis } = usePromptAnalysis(currentPromptValue, originalPrompt);
    
    useEffect(() => {
        setCurrentPromptValue(node.prompt);
        setOriginalPrompt(node.prompt);
        resetAnalysis();
    }, [node.id, node.prompt, resetAnalysis]);

    const hasChanges = currentPromptValue !== originalPrompt;

    const handleUpdate = () => {
        if (hasChanges) {
             onUpdateNode(node.id, currentPromptValue);
        }
    };

    const isLLMTaskAgent = node.type === 'LLM Task Agent';

    return (
        <div className="space-y-4">
             <div>
                <div className="flex justify-between items-center mb-2">
                    <Label htmlFor={`agent-prompt-${node.id}`} className="text-muted-foreground">Core Incantation (Prompt)</Label>
                    <Badge variant="outline">{node.type}</Badge>
                </div>
                <Textarea 
                    id={`agent-prompt-${node.id}`}
                    placeholder="e.g., 'You are a master cybersecurity analyst...'"
                    className="min-h-[200px] bg-background/50 border-border/70"
                    value={currentPromptValue}
                    onChange={(e) => setCurrentPromptValue(e.target.value)}
                    disabled={isSculpting}
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

            <Button variant="cta" className="w-full" onClick={handleUpdate} disabled={isSculpting || !hasChanges}>
                {isSculpting ? (
                    <>
                        <Loader2 className="animate-spin" />
                        AI is Sculpting...
                    </>
                ) : (
                    "Update Incantation"
                )}
            </Button>
        </div>
    );
}
