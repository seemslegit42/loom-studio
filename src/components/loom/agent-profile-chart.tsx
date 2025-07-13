
'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { AnalyzeAgentProfileOutput } from '@/ai/flows/analyze-agent-profile-schema';

interface AgentProfileChartProps {
    profile: AnalyzeAgentProfileOutput['profile'];
    agentName: string;
}

const chartConfig = {
    value: {
      label: "Score",
    },
    Creativity: {
      label: "Creativity",
      color: "hsl(var(--chart-1))",
    },
    Humor: {
      label: "Humor",
      color: "hsl(var(--chart-2))",
    },
    Formality: {
      label: "Formality",
      color: "hsl(var(--chart-3))",
    },
    Enthusiasm: {
      label: "Enthusiasm",
      color: "hsl(var(--chart-4))",
    },
    Technicality: {
        label: "Technicality",
        color: "hsl(var(--chart-5))",
    },
    Whimsy: {
        label: "Whimsy",
        color: "hsl(var(--chart-1))",
    }
} as const;


export function AgentProfileChart({ profile, agentName }: AgentProfileChartProps) {
    const chartData = profile.map(item => ({
        trait: item.trait,
        value: item.value,
        fill: chartConfig[item.trait as keyof typeof chartConfig]?.color || 'hsl(var(--primary))',
    }));
    
    return (
        <Card className="border-border/60 bg-card/40">
            <CardHeader>
                <CardTitle>Personality Matrix</CardTitle>
                <CardDescription>AI-driven analysis of "{agentName}"</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ left: 10, right: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                        <XAxis type="number" dataKey="value" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis 
                            type="category" 
                            dataKey="trait" 
                            stroke="hsl(var(--muted-foreground))"
                            width={80}
                            tickLine={false}
                            axisLine={false}
                            fontSize={12}
                        />
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--accent) / 0.1)' }}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="value" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
