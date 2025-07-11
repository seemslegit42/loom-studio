
'use client';
import { WorkflowNode, NodeStatus } from "./workflow-node";
import { useLoom } from "./loom-provider";
import { SigilRites } from "../sigil-rites/SigilRites";
import { useSystemSigilState } from "@/hooks/use-system-sigil-state";
import { useEffect, useState } from "react";

/**
 * @interface NodeState
 * @description Defines the shape of a single node within the workflow visualization.
 * @property {string} id - A unique identifier for the node.
 * @property {string} title - The title of the node displayed in its header.
 * @property {NodeStatus} status - The current execution status of the node.
 * @property {React.ReactNode} content - The content to be displayed within the node's body.
 * @property {boolean} [isImage] - If true, the content is treated as an image data URI.
 */
export interface NodeState {
    id: string;
    title: string;
    status: NodeStatus;
    content: React.ReactNode;
    isImage?: boolean;
}

/**
 * The main content canvas for Loom Studio.
 * It displays either the ceremonial `SigilRites` animation when the system is idle,
 * or the `WorkflowNode` grid showing the real-time results of an active workflow execution.
 * @returns {JSX.Element} The rendered Hall of Echoes component.
 */
const HallOfEchoes = () => {
    const { workflowNodes, timelineProgress, isPlaying, isFinished } = useLoom();
    const { variant, ritual, setRitual } = useSystemSigilState();
    
    // Determine the current ritual for the SigilRites component based on timeline state.
    useEffect(() => {
        if (isFinished) {
            setRitual('idle');
        } else if (isPlaying) {
            setRitual('orchestrate');
        } else if (timelineProgress > 0 && !isPlaying) {
            setRitual('idle'); // paused
        } else {
            setRitual('idle');
        }
    }, [isPlaying, isFinished, timelineProgress, setRitual]);

    const showSigil = timelineProgress === 0 && !isPlaying && !isFinished;

    return (
        <div className="w-full h-full flex items-center justify-center">
            {showSigil ? (
                <SigilRites variant={variant} ritual={'summon'} />
            ) : (
                <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                    {workflowNodes.map(node => (
                        <WorkflowNode
                            key={node.id}
                            title={node.title}
                            status={node.status}
                            isImage={node.isImage}
                        >
                            {node.content}
                        </WorkflowNode>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HallOfEchoes;
