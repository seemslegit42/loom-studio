import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

/**
 * Configuration form for the Agent Task node in the Inspector panel.
 * @returns {JSX.Element} The rendered form component.
 */
export function AgentTaskConfig() {
    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="agent-prompt" className="text-muted-foreground">Agent Prompt</Label>
                <Textarea 
                    id="agent-prompt" 
                    placeholder="e.g., 'Analyze the following data and return a summary...'"
                    className="mt-2 min-h-[200px] bg-background/50 border-border/70"
                />
            </div>
            <Button className="w-full glow-primary">Configure Agent</Button>
        </div>
    );
}
