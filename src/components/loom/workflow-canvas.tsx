
'use client';
import { Cpu } from "lucide-react";
import { WorkflowNode } from "./workflow-node";
import type { WorkflowNodeData, WorkflowConnection } from "@/lib/types";
import { SigilRites } from "../sigil-rites/SigilRites";
import { useState, useEffect } from "react";

interface WorkflowCanvasProps {
    nodes: WorkflowNodeData[];
    connections: WorkflowConnection[];
    selectedNodeId: string | null;
    onNodeClick: (id: string) => void;
    onNodeDragEnd: (nodeId: string, position: { x: number, y: number }) => void;
}

/**
 * Calculates the path for a smooth bezier curve between two points.
 * @param {object} startPos - The starting position {x, y}.
 * @param {object} endPos - The ending position {x, y}.
 * @returns {string} The SVG path data string.
 */
function getEdgePath(startPos: {x: number, y: number}, endPos: {x: number, y: number}): string {
    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;
    // A simple bezier curve. More complex logic could be used for fancier curves.
    return `M${startPos.x},${startPos.y} C${startPos.x + dx / 2},${startPos.y} ${endPos.x - dx / 2},${endPos.y} ${endPos.x},${endPos.y}`;
}


/**
 * The main canvas for visually orchestrating workflows. 
 * It renders the nodes and the connections between them.
 * @returns {JSX.Element} The rendered canvas component.
 */
export function WorkflowCanvas({ nodes, connections, selectedNodeId, onNodeClick, onNodeDragEnd }: WorkflowCanvasProps) {

    const [edgePaths, setEdgePaths] = useState<string[]>([]);

    useEffect(() => {
        const nodeMap = new Map(nodes.map(node => [node.id, node]));
        const canvasEl = document.getElementById('workflow-canvas');
        if (!canvasEl) return;

        const { width, height } = canvasEl.getBoundingClientRect();
        if (width === 0 || height === 0) return;

        const newPaths = connections.map(conn => {
            const sourceNode = nodeMap.get(conn.sourceId);
            const targetNode = nodeMap.get(conn.targetId);

            if (!sourceNode || !targetNode) return null;

            const sourcePos = {
                x: (sourceNode.position.x / 100) * width,
                y: (sourceNode.position.y / 100) * height,
            };
            const targetPos = {
                x: (targetNode.position.x / 100) * width,
                y: (targetNode.position.y / 100) * height,
            };

            return getEdgePath(sourcePos, targetPos);
        }).filter((path): path is string => path !== null);

        setEdgePaths(newPaths);

    }, [nodes, connections]);


    return (
        <div className="h-full w-full flex items-center justify-center p-8 bg-transparent relative overflow-hidden" id="workflow-canvas">
            {/* Background Effects & Sigil */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <SigilRites variant='klepsydra' ritual='idle' />
            </div>

            {/* Edges Layer (SVG) */}
            <svg className="absolute inset-0 w-full h-full z-[5] pointer-events-none">
                <defs>
                    <marker
                        id="arrowhead"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--primary) / 0.8)" />
                    </marker>
                </defs>
                <g>
                   {edgePaths.map((path, index) => (
                        <path
                            key={`edge-${index}`}
                            d={path}
                            stroke="hsl(var(--primary) / 0.8)"
                            strokeWidth="2"
                            fill="none"
                            markerEnd="url(#arrowhead)"
                        />
                   ))}
                </g>
            </svg>


            {/* Workflow Nodes Layer */}
            <div className="relative z-10 w-full h-full">
                {nodes.map(node => (
                    <WorkflowNode 
                        key={node.id}
                        node={node}
                        isSelected={selectedNodeId === node.id}
                        onClick={() => onNodeClick(node.id)}
                        onDragEnd={onNodeDragEnd}
                    />
                ))}
            </div>
        </div>
    );
}
