
'use client';
import { Cpu } from "lucide-react";
import { WorkflowNode } from "./workflow-node";
import type { WorkflowNodeData } from "@/lib/types";
import { SigilRites } from "../sigil-rites/SigilRites";

interface WorkflowCanvasProps {
    nodes: WorkflowNodeData[];
    selectedNodeId: string | null;
    onNodeClick: (id: string) => void;
    onNodeDragEnd: (nodeId: string, position: { x: number, y: number }) => void;
}

/**
 * The main canvas for visually orchestrating workflows. 
 * It renders the nodes and the connections between them.
 * @returns {JSX.Element} The rendered canvas component.
 */
export function WorkflowCanvas({ nodes, selectedNodeId, onNodeClick, onNodeDragEnd }: WorkflowCanvasProps) {

    return (
        <div className="h-full w-full flex items-center justify-center p-8 bg-transparent relative overflow-hidden" id="workflow-canvas">
            {/* Background Effects & Sigil */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <SigilRites variant='klepsydra' ritual='idle' />
            </div>

            {/* Workflow Nodes Layer */}
            <div className="relative z-10 w-full h-full">
                {nodes.map(node => (
                    <WorkflowNode 
                        key={node.id}
                        nodeId={node.id}
                        title={node.name}
                        icon={Cpu} // Fallback icon
                        avatarDataUri={node.avatarDataUri}
                        dataAiHint={node.dataAiHint}
                        initialPosition={node.position}
                        isSelected={selectedNodeId === node.id}
                        onClick={() => onNodeClick(node.id)}
                        onDragEnd={onNodeDragEnd}
                    />
                ))}
            </div>
        </div>
    );
}
