import { Bot, FileInput, FileOutput, PenSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const NodeCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-colors duration-300 w-52 text-center">
        <CardHeader className="pb-2">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-2">
                {icon}
            </div>
            <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
)

const Arrow = () => (
    <div className="w-16 h-px bg-primary/50 mx-4"></div>
)

export default function VisualWeaver() {
  return (
    <Card className="lg:col-span-2 h-full flex flex-col bg-card/50 backdrop-blur-sm border-accent/20">
      <CardHeader>
        <CardTitle className="font-headline text-accent">The Visual Weaver</CardTitle>
        <CardDescription>Drag-and-drop canvas for manipulating LangGraph workflows.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <div className="flex items-center">
            <NodeCard 
                icon={<FileInput className="w-6 h-6"/>}
                title="Input Node"
                description="Receives user query"
            />
            <Arrow />
            <NodeCard 
                icon={<Bot className="w-6 h-6"/>}
                title="Agent Core"
                description="Processes information"
            />
            <Arrow />
            <NodeCard 
                icon={<PenSquare className="w-6 h-6"/>}
                title="Tool Executor"
                description="Uses external tools"
            />
            <Arrow />
            <NodeCard 
                icon={<FileOutput className="w-6 h-6"/>}
                title="Output Node"
                description="Returns final response"
            />
        </div>
      </CardContent>
    </Card>
  );
}
