
'use client';
import { Cpu } from "lucide-react";
import { WorkflowNode } from "./workflow-node";
import type { WorkflowNodeData } from "@/lib/types";

interface WorkflowCanvasProps {
    children: React.ReactNode;
    nodes: WorkflowNodeData[];
    selectedNodeId: string | null;
    setSelectedNodeId: (id: string | null) => void;
}

/**
 * The main canvas for visually orchestrating workflows. 
 * It renders the nodes and the connections between them.
 * @returns {JSX.Element} The rendered canvas component.
 */
export function WorkflowCanvas({ children, nodes, selectedNodeId, setSelectedNodeId }: WorkflowCanvasProps) {

    return (
        <div className="h-full w-full flex items-center justify-center p-8 bg-transparent relative overflow-hidden">
            {/* Background Effects & Sigil */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                {children}
            </div>

            {/* Workflow Nodes Layer */}
            <div className="relative z-10 w-full h-full">
                {nodes.map(node => (
                    <WorkflowNode 
                        key={node.id}
                        title={node.name}
                        icon={Cpu} // Fallback icon
                        content={node.avatarDataUri}
                        isSelected={selectedNodeId === node.id}
                        onClick={() => setSelectedNodeId(node.id)}
                        style={{ 
                            left: `${node.position.x}%`, 
                            top: `${node.position.y}%`,
                            transform: `translate(-${node.position.x}%, -${node.position.y}%)`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
