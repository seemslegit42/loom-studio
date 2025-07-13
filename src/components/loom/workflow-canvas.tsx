
'use client';
import { Cpu } from "lucide-react";
import { WorkflowNode } from "./workflow-node";

interface WorkflowCanvasProps {
    children: React.ReactNode;
    agentName: string;
    agentAvatar: string | null;
}

/**
 * The main canvas for visually orchestrating workflows. 
 * It renders the nodes and the connections between them.
 * @returns {JSX.Element} The rendered canvas component.
 */
export function WorkflowCanvas({ children, agentName, agentAvatar }: WorkflowCanvasProps) {
    const isAgentForged = !!(agentName && agentAvatar);

    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-transparent relative overflow-hidden">
            {/* Background Effects & Sigil */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                {children}
            </div>

            {/* Workflow Nodes Layer */}
            <div className="relative z-10">
                {isAgentForged && (
                    <WorkflowNode 
                        title={agentName}
                        icon={Cpu} // Fallback icon
                        content={agentAvatar}
                    />
                )}
            </div>
        </div>
    );
}
