
import { PrimeArsenal, type ArsenalStyle } from "@/lib/styles";
import { CardDescription, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import { GlassPane } from "../ui/glass-pane";

interface StyleSelectorProps {
    onSelectStyle: (style: ArsenalStyle) => void;
}

export function StyleSelector({ onSelectStyle }: StyleSelectorProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
            {PrimeArsenal.map((style) => (
                <GlassPane 
                    key={style.name} 
                    className={cn(
                        "cursor-pointer transition-all duration-200",
                        "hover:bg-primary/10 hover:border-primary/50 hover:glow-primary"
                    )}
                    onClick={() => onSelectStyle(style)}
                >
                    <CardHeader className="p-4">
                        <CardTitle className="text-base">{style.name}</CardTitle>
                        <CardDescription className="text-xs">{style.essence}</CardDescription>
                    </CardHeader>
                </GlassPane>
            ))}
        </div>
    );
}
