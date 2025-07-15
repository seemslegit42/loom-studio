
'use client';
import { Cpu } from "lucide-react";
import { WorkflowNode } from "./workflow-node";
import type { WorkflowNodeData, WorkflowConnection } from "@/lib/types";
import { SigilRites } from "../sigil-rites/SigilRites";
import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";


interface Point {
    x: number;
    y: number;
}
interface WiringState {
    sourceId: string;
    sourcePos: Point;
    currentPos: Point;
}

interface WorkflowCanvasProps {
    nodes: WorkflowNodeData[];
    connections: WorkflowConnection[];
    selectedNodeId: string | null;
    selectedConnectionId: string | null;
    onNodeClick: (id: string) => void;
    onConnectionClick: (id: string) => void;
    onCanvasClick: () => void;
    onNodeDragEnd: (nodeId: string, position: Point) => void;
    onCreateConnection: (sourceId: string, targetId: string) => void;
    isExecuting: boolean;
}

/**
 * Calculates the path for a smooth bezier curve between two points.
 * @param {object} startPos - The starting position {x, y}.
 * @param {object} endPos - The ending position {x, y}.
 * @returns {string} The SVG path data string.
 */
function getEdgePath(startPos: Point, endPos: Point): string {
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
    onNodeDragEnd,
    onCreateConnection,
    isExecuting,
}: WorkflowCanvasProps) {

    const canvasRef = useRef<HTMLDivElement>(null);
    const nodeElementsRef = useRef<Map<string, HTMLDivElement>>(new Map());
    const [edgePaths, setEdgePaths] = useState<Map<string, string>>(new Map());
    const [wiringState, setWiringState] = useState<WiringState | null>(null);

    const getNodeElementById = (id: string) => document.getElementById(`node-${id}`);

    const updatePaths = useCallback(() => {
        const nodeMap = new Map(nodes.map(node => [node.id, node]));

        const newPaths = new Map<string, string>();
        connections.forEach(conn => {
            const sourceNodeEl = getNodeElementById(conn.sourceId);
            const targetNodeEl = getNodeElementById(conn.targetId);

            if (!sourceNodeEl || !targetNodeEl) return;

            const sourceRect = sourceNodeEl.getBoundingClientRect();
            const targetRect = targetNodeEl.getBoundingClientRect();
            const canvasRect = canvasRef.current!.getBoundingClientRect();

            const sourcePos = {
                x: sourceRect.right - canvasRect.left,
                y: sourceRect.top + sourceRect.height / 2 - canvasRect.top,
            };
            const targetPos = {
                x: targetRect.left - canvasRect.left,
                y: targetRect.top + targetRect.height / 2 - canvasRect.top,
            };
            newPaths.set(conn.id, getEdgePath(sourcePos, targetPos));
        });
        setEdgePaths(newPaths);
    }, [nodes, connections]);

    useEffect(() => {
        updatePaths();
        const resizeObserver = new ResizeObserver(updatePaths);
        if (canvasRef.current) {
            resizeObserver.observe(canvasRef.current);
        }
        return () => resizeObserver.disconnect();
    }, [updatePaths]);
    
    // Update paths when nodes move
    useEffect(() => {
        updatePaths();
    }, [nodes, updatePaths]);

    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Ensure the click is on the canvas itself, not a node.
        if (e.target === canvasRef.current) {
            onCanvasClick();
        }
    };

    const handleStartWiring = useCallback((sourceId: string, e: React.MouseEvent<HTMLDivElement>) => {
        if (isExecuting) return;
        e.preventDefault();
        e.stopPropagation();
        
        const sourceNodeEl = getNodeElementById(sourceId);
        if (!sourceNodeEl) return;

        const canvasRect = canvasRef.current!.getBoundingClientRect();
        const sourceRect = sourceNodeEl.getBoundingClientRect();

        const startPos = {
            x: sourceRect.right - canvasRect.left,
            y: sourceRect.top + sourceRect.height / 2 - canvasRect.top,
        };

        setWiringState({
            sourceId,
            sourcePos: startPos,
            currentPos: { x: e.clientX - canvasRect.left, y: e.clientY - canvasRect.top },
        });

    }, [isExecuting]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!wiringState || !canvasRef.current) return;
        const canvasRect = canvasRef.current.getBoundingClientRect();
        setWiringState(prev => prev ? ({
            ...prev,
            currentPos: { x: e.clientX - canvasRect.left, y: e.clientY - canvasRect.top },
        }) : null);
    }, [wiringState]);

    const handleMouseUp = useCallback(() => {
        setWiringState(null);
    }, []);

    useEffect(() => {
        if (wiringState) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp, { once: true });
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [wiringState, handleMouseMove, handleMouseUp]);

    const handleNodeMouseUp = (targetId: string) => {
        if (wiringState && wiringState.sourceId !== targetId) {
            onCreateConnection(wiringState.sourceId, targetId);
        }
    };


    return (
        <div 
            ref={canvasRef}
            className="h-full w-full flex items-center justify-center p-8 bg-transparent relative overflow-hidden" 
            id="workflow-canvas"
            onClick={handleCanvasClick}
            onMouseUpCapture={handleMouseUp}
        >
            {/* Background Effects & Sigil */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <SigilRites variant='klepsydra' ritual={isExecuting ? 'orchestrate' : 'idle'} />
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
                     <linearGradient id="edge-gradient-wiring" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{stopColor: 'hsl(var(--accent))', stopOpacity: 1}} />
                        <stop offset="100%" style={{stopColor: 'hsl(var(--accent))', stopOpacity: 0.3}} />
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
                                className={cn("cursor-pointer pointer-events-stroke", isExecuting && "pointer-events-none")}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onConnectionClick(id)
                                }}
                            />
                        </g>
                   ))}
                   {wiringState && (
                        <path 
                            d={getEdgePath(wiringState.sourcePos, wiringState.currentPos)}
                            stroke="url(#edge-gradient-wiring)"
                            strokeWidth="2"
                            fill="none"
                            strokeDasharray="4 4"
                        />
                   )}
                </g>
            </svg>


            {/* Workflow Nodes Layer */}
            <div className="relative w-full h-full">
                {nodes.map(node => (
                    <WorkflowNode 
                        key={node.id}
                        node={node}
                        isSelected={selectedNodeId === node.id}
                        isWiring={!!wiringState}
                        onClick={(e) => {
                            if (isExecuting) return;
                            e.stopPropagation();
                            onNodeClick(node.id)
                        }}
                        onDragEnd={onNodeDragEnd}
                        onStartWiring={(e) => handleStartWiring(node.id, e)}
                        onMouseUpCapture={() => handleNodeMouseUp(node.id)}
                        isExecuting={isExecuting}
                    />
                ))}
            </div>
        </div>
    );
}

    
