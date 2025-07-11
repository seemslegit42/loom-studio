
'use client';
import { WorkflowNode, NodeStatus } from "./workflow-node";
import { useLoom } from "./loom-provider";

export interface NodeState {
    id: string;
    title: string;
    status: NodeStatus;
    content: React.ReactNode;
    isImage?: boolean;
}

const HallOfEchoes = () => {
    const { workflowNodes } = useLoom();

    return (
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
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
    );
};

export default HallOfEchoes;
