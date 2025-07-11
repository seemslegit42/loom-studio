
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { LoaderCircle, CheckCircle2, XCircle, History } from "lucide-react";
import Image from "next/image";

/**
 * @typedef NodeStatus
 * @description Represents the possible execution statuses of a workflow node.
 * @property {'idle'} - The node is awaiting execution.
 * @property {'running'} - The node is currently being processed.
 * @property {'success'} - The node completed execution successfully.
 * @property {'error'} - The node encountered an error during execution.
 */
export type NodeStatus = "idle" | "running" | "success" | "error";

/**
 * @interface WorkflowNodeProps
 * @description Props for the WorkflowNode component.
 * @property {string} title - The title displayed in the node's header.
 * @property {NodeStatus} status - The current execution status of the node.
 * @property {React.ReactNode} children - The content to display inside the node.
 * @property {boolean} [isImage=false] - If true, the content is treated as an image URL.
 */
interface WorkflowNodeProps {
  title: string;
  status: NodeStatus;
  children: React.ReactNode;
  isImage?: boolean;
}

const statusIcons: Record<NodeStatus, React.ReactNode> = {
  idle: <History className="text-muted-foreground" />,
  running: <LoaderCircle className="animate-spin text-primary" />,
  success: <CheckCircle2 className="text-green-500" />,
  error: <XCircle className="text-destructive" />,
};

const statusStyles: Record<NodeStatus, string> = {
    idle: 'border-muted/20',
    running: 'border-primary/50 animate-pulse-glow shadow-primary/20',
    success: 'border-green-500/50',
    error: 'border-destructive/50',
}

/**
 * A component that visually represents a single node in a workflow.
 * It displays the node's title, status (with a corresponding icon and styling),
 * and its content, which can be text or an image.
 * @param {WorkflowNodeProps} props - The props for the component.
 * @returns {JSX.Element} The rendered workflow node card.
 */
export function WorkflowNode({ title, status, children, isImage = false }: WorkflowNodeProps) {
  return (
    <Card className={cn(
        "w-full h-full flex flex-col transition-all duration-300 bg-card/50 backdrop-blur-sm", 
        statusStyles[status]
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {statusIcons[status]}
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center text-center p-2">
        {isImage && typeof children === 'string' && status === 'success' ? (
          <Image 
            src={children} 
            alt={title}
            width={128}
            height={128}
            className="rounded-lg object-cover max-h-[90%] w-auto"
            data-ai-hint="futuristic interface"
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
