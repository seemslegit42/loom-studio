import { PaletteNode } from "./palette-node";
import { ScrollArea } from "../ui/scroll-area";
import { workflowNodeCodex } from "@/lib/codex";
import type { CodexNode } from "@/lib/codex";

/**
 * The Palette panel component, which displays a list of all available
 * workflow nodes that can be dragged onto the canvas, as defined by the Architect's Codex.
 * It groups nodes by their "Pantheon" (family) for clarity.
 * @returns {JSX.Element} The rendered palette component.
 */
export function WorkflowNodePalette() {
    // Group nodes by their family (Pantheon)
    const pantheons = workflowNodeCodex.reduce((acc, node) => {
        if (!acc[node.family]) {
            acc[node.family] = [];
        }
        acc[node.family].push(node);
        return acc;
    }, {} as Record<CodexNode['family'], CodexNode[]>);

    const pantheonOrder: CodexNode['family'][] = ["Core", "Logic", "Agent", "Oracle", "Connection", "Advanced"];

    // A flag to control dev mode, will be moved to context/state later
    const showDevMode = false;

    return (
        <ScrollArea className="h-full">
            <div className="flex flex-col gap-6 pr-4">
                {pantheonOrder.map(pantheon => (
                    pantheons[pantheon] && pantheons[pantheon].length > 0 && (
                        <div key={pantheon} className="space-y-3">
                            <h3 className="font-semibold text-muted-foreground tracking-wider text-sm">{pantheon.toUpperCase()}</h3>
                            <div className="space-y-2">
                                {pantheons[pantheon].map(node => (
                                    <PaletteNode 
                                        key={node.name}
                                        icon={node.icon} 
                                        name={node.name}
                                        subtitle={node.subtitle}
                                        description={node.tooltip}
                                        devLabel={showDevMode ? node.devLabel : undefined}
                                    />
                                ))}
                            </div>
                        </div>
                    )
                ))}
            </div>
        </ScrollArea>
    );
}
