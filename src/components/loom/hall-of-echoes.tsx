
'use client';
import { WorkflowNode, NodeStatus } from "./workflow-node";
import { useLoom } from "./loom-provider";
import { useEffect, useState } from "react";

const SIMULATION_STEPS = [
    { title: "Initiate contact", duration: 10 },
    { title: "Authenticate credentials", duration: 15 },
    { title: "Query vector database", duration: 25 },
    { title: "Generate report", duration: 20 },
    { title: "Render keyframe", duration: 15 },
    { title: "Finalize & sign", duration: 5 },
];

export interface NodeState {
    id: string;
    title: string;
    status: NodeStatus;
    content: React.ReactNode;
    isImage?: boolean;
}

const HallOfEchoes = () => {
    const { timelineProgress, timelineDuration } = useLoom();
    const [nodes, setNodes] = useState<NodeState[]>([]);

    useEffect(() => {
        let cumulativeDuration = 0;
        const newNodes: NodeState[] = SIMULATION_STEPS.map((step, index) => {
            const stepStart = cumulativeDuration;
            const stepEnd = cumulativeDuration + step.duration;
            cumulativeDuration = stepEnd;

            let status: NodeStatus = 'idle';
            const progressPercent = (timelineProgress / timelineDuration) * 100;
            const stepStartPercent = (stepStart / timelineDuration) * 100;
            const stepEndPercent = (stepEnd / timelineDuration) * 100;
            
            if (progressPercent >= stepEndPercent) {
                status = 'success';
            } else if (progressPercent >= stepStartPercent) {
                status = 'running';
            }

            let content: React.ReactNode = "Awaiting execution...";
            if (status === 'running') {
                content = "Processing...";
            } else if (status === 'success') {
                if (step.title === "Render keyframe") {
                    content = `https://placehold.co/128x128.png`;
                } else if (step.title === "Generate report") {
                    content = `Report generated successfully. Sector 7-G shows a 35% increase in anomalous activity. Recommending immediate investigation.`
                } else {
                    content = "Completed successfully.";
                }
            }


            return {
                id: `node-${index}`,
                title: step.title,
                status,
                content: content,
                isImage: step.title === "Render keyframe",
            };
        });

        setNodes(newNodes);

    }, [timelineProgress, timelineDuration]);


    return (
        <div className="w-full h-full grid grid-cols-2 grid-rows-3 gap-4">
           {nodes.map(node => (
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
    );
};

export default HallOfEchoes;
