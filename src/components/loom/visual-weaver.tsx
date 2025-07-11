'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLoom } from './loom-provider';
import { WorkflowNode } from './workflow-node';
import { ArrowRight } from 'lucide-react';

export type NodeStatus = 'idle' | 'running' | 'success' | 'error';

export type WorkflowNodeState = {
  title: string;
  status: NodeStatus;
  content: string | null;
};

export interface WorkflowState {
  analysis: WorkflowNodeState;
  avatar: WorkflowNodeState;
  profile: WorkflowNodeState;
}

export default function VisualWeaver() {
  const { workflowState } = useLoom();

  return (
    <Card className="h-full flex flex-col bg-card/80 backdrop-blur-sm border-accent/20 shadow-lg shadow-accent/5">
      <CardHeader>
        <CardTitle className="font-headline text-accent">The Visual Weaver</CardTitle>
        <CardDescription>Observe the agentic patterns as they are woven into existence.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center p-4 lg:p-6">
        <div className="w-full flex items-center justify-center gap-4">
            <WorkflowNode
                title={workflowState.analysis.title}
                status={workflowState.analysis.status}
            >
                {workflowState.analysis.content}
            </WorkflowNode>

            <ArrowRight className="w-8 h-8 text-muted-foreground shrink-0" />
            
            <WorkflowNode
                title={workflowState.avatar.title}
                status={workflowState.avatar.status}
                isImage={workflowState.avatar.status === 'success'}
            >
                 {workflowState.avatar.content}
            </WorkflowNode>
            
            <ArrowRight className="w-8 h-8 text-muted-foreground shrink-0" />

            <WorkflowNode
                title={workflowState.profile.title}
                status={workflowState.profile.status}
            >
                {workflowState.profile.content}
            </WorkflowNode>
        </div>
      </CardContent>
    </Card>
  );
}
