import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface AgentTaskConfigProps {
    onConfigure: (prompt: string) => Promise<void>;
    isConfiguring: boolean;
}

/**
 * Configuration form for the Agent Task node in the Inspector panel.
 * @returns {JSX.Element} The rendered form component.
 */
export function AgentTaskConfig({ onConfigure, isConfiguring }: AgentTaskConfigProps) {
    const [prompt, setPrompt] = useState('');

    const handleConfigure = () => {
        if (prompt.trim()) {
            onConfigure(prompt);
        }
    }

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="agent-prompt" className="text-muted-foreground">Agent Prompt</Label>
                <Textarea 
                    id="agent-prompt" 
                    placeholder="e.g., 'You are a master cybersecurity analyst. Your goal is to analyze security logs and identify potential threats...'"
                    className="mt-2 min-h-[200px] bg-background/50 border-border/70"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isConfiguring}
                />
            </div>
            <Button className="w-full glow-primary" onClick={handleConfigure} disabled={isConfiguring || !prompt.trim()}>
                {isConfiguring ? (
                    <>
                        <Loader2 className="animate-spin" />
                        Forging...
                    </>
                ) : (
                    "Configure Agent"
                )}
            </Button>
        </div>
    );
}
