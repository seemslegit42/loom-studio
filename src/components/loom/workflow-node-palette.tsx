
'use client';

import { PaletteNode } from "./palette-node";
import { ScrollArea } from "../ui/scroll-area";
import { workflowNodeCodex } from "@/lib/codex";
import type { CodexNode } from "@/lib/codex";
import { useState } from "react";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

interface WorkflowNodePaletteProps {
    onNodeSelect: (node: CodexNode) => void;
}

/**
 * The Palette panel component, which displays a list of all available
 * workflow nodes that can be dragged onto the canvas, as defined by the Architect's Codex.
 * It groups nodes by their "Pantheon" (family) for clarity.
 * @returns {JSX.Element} The rendered palette component.
 */
export function WorkflowNodePalette({ onNodeSelect }: WorkflowNodePaletteProps) {
    // Group nodes by their family (Pantheon)
    const pantheons = workflowNodeCodex.reduce((acc, node) => {
        const family = node.family ?? 'Advanced';
        if (!acc[family]) {
            acc[family] = [];
        }
        acc[family].push(node);
        return acc;
    }, {} as Record<CodexNode['family'], CodexNode[]>);

    const pantheonOrder: CodexNode['family'][] = ["Core", "Logic", "Agent", "Oracle", "Connection", "Data", "Advanced"];

    const [showDevMode, setShowDevMode] = useState(false);

    return (
        <div className="h-full flex flex-col">
            <ScrollArea className="flex-1 -mr-4 pr-4">
                <div className="flex flex-col gap-6">
                    {pantheonOrder.map(pantheon => (
                        pantheons[pantheon] && pantheons[pantheon].length > 0 && (
                            <div key={pantheon} className="space-y-3">
                                <h3 className="font-semibold text-muted-foreground tracking-wider text-sm">{pantheon.toUpperCase()}</h3>
                                <div className="space-y-2">
                                    {pantheons[pantheon].map(node => (
                                        // We filter out the Archetype family here as they are handled in the header
                                        node.family !== 'Archetype' && (
                                            <PaletteNode 
                                                key={node.name}
                                                icon={node.icon} 
                                                name={node.name}
                                                subtitle={node.subtitle}
                                                description={node.tooltip}
                                                devLabel={showDevMode ? node.devLabel : undefined}
                                                onClick={() => onNodeSelect(node)}
                                            />
                                        )
                                    ))}
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </ScrollArea>
            <div className="flex items-center space-x-2 pt-4 border-t border-border/50">
                <Switch 
                    id="dev-mode" 
                    checked={showDevMode}
                    onCheckedChange={setShowDevMode}
                    />
                <Label htmlFor="dev-mode" className="text-sm">Architect's View</Label>
            </div>
        </div>
    );
}
