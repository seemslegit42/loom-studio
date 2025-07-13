import { PaletteNode } from "./palette-node";
import { ScrollArea } from "../ui/scroll-area";
import { workflowNodeCodex } from "@/lib/codex";
import type { CodexNode } from "@/lib/codex";

/**
 * The Palette panel component, which displays a list of all available
 * workflow nodes that can be dragged onto the canvas, as defined by the Architect's Codex.
 * @returns {JSX.Element} The rendered palette component.
 */
export function WorkflowNodePalette() {
    // This could be moved to a hook or selector for memoization
    const families = workflowNodeCodex.reduce((acc, node) => {
        if (!acc[node.family]) {
            acc[node.family] = [];
        }
        acc[node.family].push(node);
        return acc;
    }, {} as Record<CodexNode['family'], CodexNode[]>);

    const familyOrder: CodexNode['family'][] = ["Core", "Logic", "Agent", "Connection"];

    // A flag to control dev mode, will be moved to context/state later
    const showDevMode = false;

    return (
        <ScrollArea className="h-full">
            <div className="flex flex-col gap-6 pr-4">
                {familyOrder.map(family => (
                    families[family] && families[family].length > 0 && (
                        <div key={family} className="space-y-3">
                            <h3 className="font-semibold text-muted-foreground tracking-wider text-sm">{family.toUpperCase()}</h3>
                            <div className="space-y-2">
                                {families[family].map(node => (
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
