
/**
 * @fileOverview A panel for displaying the chronological audit log of system events.
 */
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLoomStore } from "@/hooks/useLoomStore";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { GitBranch, Sparkles, Cpu, Link, Palette, Play, Trash2, Edit } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import type { AuditLogEntry } from "@/lib/store/createAuditSlice";


const getIconForAction = (action: string) => {
    if (action.includes('FORGE') || action.includes('SUMMON')) return Sparkles;
    if (action.includes('DELETED')) return Trash2;
    if (action.includes('AGENT')) return Cpu;
    if (action.includes('NEXUS')) return Link;
    if (action.includes('PALETTE')) return Palette;
    if (action.includes('PROMPT') || action.includes('SCULPTED') || action.includes('REFORGED')) return Edit;
    if (action.includes('EXECUTION')) return Play;
    return Sparkles;
}

interface TimelinePanelProps {
  onLogSelect: (log: AuditLogEntry | null) => void;
}


/**
 * Displays a chronological list of all significant actions taken within the Loom,
 * providing a high-level audit trail for debugging and observability.
 * @returns {JSX.Element}
 */
export function TimelinePanel({ onLogSelect }: TimelinePanelProps) {
    const { auditLog, selectedLogId } = useLoomStore();

    return (
        <div className="h-full flex flex-col p-4 bg-background/50">
            <h2 className="text-lg font-headline text-muted-foreground pb-4 hidden md:block">Timeline</h2>
            <ScrollArea className="flex-1 -mr-4 pr-4">
                <TooltipProvider>
                    <Table>
                        <TableBody>
                            {auditLog.map(log => {
                                const Icon = getIconForAction(log.action);
                                return (
                                    <Tooltip key={log.id} delayDuration={300}>
                                         <TableRow 
                                            className={cn(
                                                "cursor-pointer transition-colors",
                                                selectedLogId === log.id && "bg-primary/10"
                                            )}
                                            onClick={() => onLogSelect(log.id === selectedLogId ? null : log)}
                                        >
                                            <TooltipTrigger asChild>
                                                <TableCell className="w-12 p-2 text-center">
                                                    <div className="inline-flex">
                                                        <Icon className="h-4 w-4 mx-auto text-primary/80"/>
                                                    </div>
                                                </TableCell>
                                            </TooltipTrigger>
                                            <TableCell className="p-2">
                                                <p className="font-semibold text-foreground/90">{log.action.replace(/_/g, ' ')}</p>
                                                <p className="text-xs text-muted-foreground">{log.metadata?.agentName || log.metadata?.nodeType || ''}</p>
                                            </TableCell>
                                            <TableCell className="p-2 text-right text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                                            </TableCell>
                                        </TableRow>
                                        <TooltipContent side="top" className="max-w-md">
                                            <div className="text-xs space-y-1 font-mono bg-background/80 p-2 rounded-md border border-border">
                                                <p><span className="font-semibold text-foreground">Action:</span> {log.action}</p>
                                                <p><span className="font-semibold text-foreground">Timestamp:</span> {new Date(log.timestamp).toISOString()}</p>
                                                <p><span className="font-semibold text-foreground">ID:</span> {log.id}</p>
                                                <p className="font-semibold text-foreground">Metadata:</p>
                                                <pre className="text-muted-foreground whitespace-pre-wrap break-all max-h-48 overflow-y-auto">
                                                    {JSON.stringify(log.metadata, null, 2)}
                                                </pre>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TooltipProvider>
            </ScrollArea>
        </div>
    );
}
