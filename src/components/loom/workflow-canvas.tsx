
'use client';
import { Cpu } from "lucide-react";
import { WorkflowNode } from "./workflow-node";
import type { WorkflowNodeData, WorkflowConnection } from "@/lib/types";
import { SigilRites } from "../sigil-rites/SigilRites";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";


interface WorkflowCanvasProps {
    nodes: WorkflowNodeData[];
    connections: WorkflowConnection[];
    selectedNodeId: string | null;
    selectedConnectionId: string | null;
    onNodeClick: (id: string) => void;
    onConnectionClick: (id: string) => void;
    onCanvasClick: () => void;
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
    // A simple bezier curve. More complex logic could be used for fancier curves.
    return `M${startPos.x},${startPos.y} C${startPos.x + dx * 0.5},${startPos.y} ${endPos.x - dx * 0.5},${endPos.y} ${endPos.x},${endPos.y}`;
}


/**
 * The main canvas for visually orchestrating workflows. 
 * It renders the nodes and the connections between them.
 * @returns {JSX.Element} The rendered canvas component.
 */
export function WorkflowCanvas({ 
    nodes, 
    connections, 
    selectedNodeId, 
    selectedConnectionId,
    onNodeClick, 
    onConnectionClick,
    onCanvasClick,
    onNodeDragEnd 
}: WorkflowCanvasProps) {

    const canvasRef = useRef<HTMLDivElement>(null);
    const [edgePaths, setEdgePaths] = useState<Map<string, string>>(new Map());

    useEffect(() => {
        const nodeMap = new Map(nodes.map(node => [node.id, node]));
        const canvasEl = canvasRef.current;
        if (!canvasEl) return;

        const updatePaths = () => {
            const { width, height } = canvasEl.getBoundingClientRect();
            if (width === 0 || height === 0) return;

            const newPaths = new Map<string, string>();
            connections.forEach(conn => {
                const sourceNode = nodeMap.get(conn.sourceId);
                const targetNode = nodeMap.get(conn.targetId);

                if (!sourceNode || !targetNode) return;

                const sourcePos = {
                    x: (sourceNode.position.x / 100) * width,
                    y: (sourceNode.position.y / 100) * height,
                };
                const targetPos = {
                    x: (targetNode.position.x / 100) * width,
                    y: (targetNode.position.y / 100) * height,
                };
                newPaths.set(conn.id, getEdgePath(sourcePos, targetPos));
            });

            setEdgePaths(newPaths);
        };
        
        updatePaths(); // Initial calculation

        const resizeObserver = new ResizeObserver(updatePaths);
        resizeObserver.observe(canvasEl);

        return () => resizeObserver.disconnect();

    }, [nodes, connections]);

    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Ensure the click is on the canvas itself, not a node.
        if (e.target === canvasRef.current) {
            onCanvasClick();
        }
    };


    return (
        <div 
            ref={canvasRef}
            className="h-full w-full flex items-center justify-center p-8 bg-transparent relative overflow-hidden" 
            id="workflow-canvas"
            onClick={handleCanvasClick}
        >
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
                        viewBox="-5 -5 10 10"
                        refX="0"
                        refY="0"
                        markerWidth="5"
                        markerHeight="5"
                        orient="auto-start-reverse"
                    >
                        <circle cx="0" cy="0" r="2" fill="hsl(var(--primary) / 0.8)"></circle>
                    </marker>
                     <marker
                        id="arrowhead-selected"
                        viewBox="-5 -5 10 10"
                        refX="0"
                        refY="0"
                        markerWidth="5"
                        markerHeight="5"
                        orient="auto-start-reverse"
                    >
                         <circle cx="0" cy="0" r="2" className="fill-[hsl(var(--gilded-accent))]"></circle>
                         <circle cx="0" cy="0" r="2" className="fill-[hsl(var(--gilded-accent))] glow-gilded" style={{ animation: 'pulse-glow 1.5s infinite ease-in-out' }}></circle>
                    </marker>
                    <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 0.8}} />
                        <stop offset="100%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 0.1}} />
                    </linearGradient>
                    <linearGradient id="edge-gradient-selected" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{stopColor: 'hsl(var(--gilded-accent))', stopOpacity: 1}} />
                        <stop offset="100%" style={{stopColor: 'hsl(var(--gilded-accent))', stopOpacity: 0.3}} />
                    </linearGradient>
                </defs>
                <g>
                   {Array.from(edgePaths.entries()).map(([id, path]) => (
                        <g key={`edge-group-${id}`}>
                            <path
                                d={path}
                                className={cn(
                                    "transition-all duration-300",
                                )}
                                stroke={selectedConnectionId === id ? "url(#edge-gradient-selected)" : "url(#edge-gradient)"}
                                strokeWidth={selectedConnectionId === id ? 2.5 : 1.5}
                                fill="none"
                                markerEnd={selectedConnectionId === id ? "url(#arrowhead-selected)" : "url(#arrowhead)"}
                            />
                            {/* Invisible wider path for easier clicking */}
                             <path
                                d={path}
                                stroke="transparent"
                                strokeWidth="20"
                                fill="none"
                                className="cursor-pointer pointer-events-stroke"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onConnectionClick(id)
                                }}
                            />
                        </g>
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
                        onClick={(e) => {
                            e.stopPropagation();
                            onNodeClick(node.id)
                        }}
                        onDragEnd={onNodeDragEnd}
                    />
                ))}
            </div>
        </div>
    );
}
