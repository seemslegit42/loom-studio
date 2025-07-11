import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { LoaderCircle, CheckCircle2, XCircle, CircleSlash } from "lucide-react";
import Image from "next/image";
import type { NodeStatus } from "./visual-weaver";

interface WorkflowNodeProps {
  title: string;
  status: NodeStatus;
  children: React.ReactNode;
  isImage?: boolean;
}

const statusIcons: Record<NodeStatus, React.ReactNode> = {
  idle: <CircleSlash className="text-muted-foreground" />,
  running: <LoaderCircle className="animate-spin text-primary" />,
  success: <CheckCircle2 className="text-green-500" />,
  error: <XCircle className="text-destructive" />,
};

const statusBorder: Record<NodeStatus, string> = {
    idle: 'border-muted/20',
    running: 'border-primary/50 animate-pulse',
    success: 'border-green-500/50',
    error: 'border-destructive/50',
}

export function WorkflowNode({ title, status, children, isImage = false }: WorkflowNodeProps) {
  return (
    <Card className={cn("w-full h-48 flex flex-col transition-all duration-300", statusBorder[status])}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {statusIcons[status]}
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center text-center">
        {isImage && typeof children === 'string' ? (
          <Image 
            src={children} 
            alt={title}
            width={128}
            height={128}
            className="rounded-lg object-cover"
            data-ai-hint="futuristic avatar"
          />
        ) : (
          <p className="text-xs text-muted-foreground p-2">
            {children || "Awaiting execution..."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
