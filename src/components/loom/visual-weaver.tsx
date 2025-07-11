'use client';
import React, { useState } from 'react';
import { Bot, FileInput, FileOutput, PenSquare, Move } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const initialNodes = [
  { id: 'input', icon: FileInput, title: 'Input Node', description: 'Receives user query' },
  { id: 'agent', icon: Bot, title: 'Agent Core', description: 'Processes information' },
  { id: 'tools', icon: PenSquare, title: 'Tool Executor', description: 'Uses external tools' },
  { id: 'output', icon: FileOutput, title: 'Output Node', description: 'Returns final response' },
];

const NodeCard = ({ icon, title, description, onDragStart, id }: { icon: React.ReactNode, title: string, description: string, onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void, id: string }) => (
    <div draggable onDragStart={(e) => onDragStart(e, id)}>
        <Card className="bg-card/70 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-colors duration-300 w-52 text-center cursor-grab active:cursor-grabbing shadow-lg hover:shadow-primary/20">
            <CardHeader className="pb-2 relative">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-2">
                    {icon}
                </div>
                <CardTitle className="text-base">{title}</CardTitle>
                 <Move className="absolute top-2 right-2 w-4 h-4 text-muted-foreground/50" />
            </CardHeader>
            <CardContent>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    </div>
);

const Arrow = () => (
    <div className="w-16 h-px bg-gradient-to-r from-primary/50 to-accent/50 mx-4" />
);

export default function VisualWeaver() {
  const [nodes, setNodes] = useState(initialNodes);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData('nodeId', id);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('nodeId');
    if (sourceId === targetId) return;

    const sourceIndex = nodes.findIndex(n => n.id === sourceId);
    const targetIndex = nodes.findIndex(n => n.id === targetId);
    
    const newNodes = [...nodes];
    const [removed] = newNodes.splice(sourceIndex, 1);
    newNodes.splice(targetIndex, 0, removed);
    setNodes(newNodes);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <Card className="h-full flex flex-col bg-card/80 backdrop-blur-sm border-accent/20 shadow-lg shadow-accent/5">
      <CardHeader>
        <CardTitle className="font-headline text-accent">The Visual Weaver</CardTitle>
        <CardDescription>Drag and drop to re-order the agent workflow.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center p-8">
        <div className="flex items-center">
            {nodes.map((node, index) => (
              <React.Fragment key={node.id}>
                <div onDrop={(e) => handleDrop(e, node.id)} onDragOver={handleDragOver}>
                    <NodeCard 
                        id={node.id}
                        icon={<node.icon className="w-7 h-7"/>}
                        title={node.title}
                        description={node.description}
                        onDragStart={handleDragStart}
                    />
                </div>
                {index < nodes.length - 1 && <Arrow />}
              </React.Fragment>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
