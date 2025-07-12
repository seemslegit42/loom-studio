
'use client';

import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

/**
 * @typedef ResonanceColor
 * @description The color variant for the ResonanceField.
 * @property {'purple'} - Imperial Purple.
 * @property {'green'} - Patina Green.
 * @property {'aqua'} - Roman Aqua.
 */
type ResonanceColor = 'purple' | 'green' | 'aqua';

/**
 * @interface ResonanceFieldProps
 * @description Props for the ResonanceField component.
 * @property {string} title - The title displayed for the field.
 * @property {ResonanceColor} color - The color variant for the field's glow and border.
 * @property {React.ReactNode} children - The content to be rendered inside the field.
 * @property {string} [className] - Optional additional CSS classes.
 */
interface ResonanceFieldProps {
    title: string;
    color: ResonanceColor;
    children: React.ReactNode;
    className?: string;
}

const colorStyles: Record<ResonanceColor, { border: string, glow: string }> = {
    purple: {
        border: 'border-resonance-purple/40',
        glow: 'glow-purple',
    },
    green: {
        border: 'border-resonance-green/40',
        glow: 'glow-green',
    },
    aqua: {
        border: 'border-resonance-aqua/40',
        glow: 'glow-aqua',
    }
};

/**
 * A component that visually groups other components within a colored, glowing boundary.
 * This serves the "Visual Chunking" requirement of the Architect's Cipher Protocol,
 * allowing architects to organize complex workflows into smaller, more digestible blocks.
 * @param {ResonanceFieldProps} props - The props for the component.
 * @returns {JSX.Element} The rendered ResonanceField component.
 */
export function ResonanceField({ title, color, children, className }: ResonanceFieldProps) {
    const styles = colorStyles[color];

    return (
        <div className={cn("rounded-xl p-4 border-2 bg-card/20 backdrop-blur-sm transition-all", styles.border, styles.glow, className)}>
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground tracking-widest uppercase">{title}</h3>
            {children}
        </div>
    );
}
