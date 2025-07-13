/**
 * @fileOverview A component for displaying an agent's core, immutable data.
 */
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { WorkflowNodeData } from "@/lib/types";
import { Fingerprint, BrainCircuit, Activity, Hash } from "lucide-react";

interface AgentDNAViewerProps {
    node: WorkflowNodeData;
}

const dnaFields = [
    { key: 'id', label: 'Agent ID', icon: Hash },
    { key: 'type', label: 'Type', icon: BrainCircuit },
    { key: 'behavioralState', label: 'State', icon: Activity },
    { key: 'signature', label: 'Signature', icon: Fingerprint },
] as const;


/**
 * Displays the core, "genetic" information of an agent node, such as its ID, type, and signature.
 * @returns {JSX.Element}
 */
export function AgentDNAViewer({ node }: AgentDNAViewerProps) {
    const formatValue = (key: (typeof dnaFields)[number]['key'], value: any) => {
        if (!value) return <span className="text-muted-foreground/60">N/A</span>;
        
        switch (key) {
            case 'id':
            case 'signature':
                return <span className="font-mono text-xs break-all">{value}</span>;
            case 'behavioralState':
                return <Badge variant={value === 'Error' ? 'destructive' : 'secondary'}>{value}</Badge>;
            default:
                return value;
        }
    }

    return (
        <Card className="border-border/60 bg-card/40">
            <CardHeader>
                <CardTitle>Agent DNA</CardTitle>
                <CardDescription>Core identity and state of "{node.name}".</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableBody>
                        {dnaFields.map(({ key, label, icon: Icon }) => (
                             <TableRow key={key} className="border-b-border/30">
                                <TableCell className="font-semibold w-1/3 flex items-center gap-2 text-muted-foreground p-2">
                                    <Icon className="h-4 w-4"/>
                                    {label}
                                </TableCell>
                                <TableCell className="p-2">
                                    {formatValue(key, node[key as keyof WorkflowNodeData])}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
