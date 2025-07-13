/**
 * @fileOverview Centralized type definitions for the Loom Studio application.
 */
import { z } from 'zod';
import type { AnalyzeAgentProfileOutput } from "@/ai/flows/analyze-agent-profile-schema";

export const BehavioralStateSchema = z.enum(['Idle', 'Executing', 'Error']);
export type BehavioralState = z.infer<typeof BehavioralStateSchema>;

/**
 * Zod schema for a single node on the workflow canvas.
 */
export const WorkflowNodeDataSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(), // Corresponds to devLabel from CodexNode
    avatarDataUri: z.string(),
    dataAiHint: z.string().optional(),
    profile: z.array(z.object({
        trait: z.string(),
        value: z.number(),
    })),
    position: z.object({
        x: z.number(),
        y: z.number(),
    }),
    prompt: z.string(),
    signature: z.string().optional(),
    behavioralState: BehavioralStateSchema,
});


/**
 * Represents the data for a single node on the workflow canvas.
 */
export interface WorkflowNodeData extends z.infer<typeof WorkflowNodeDataSchema> {};


/**
 * Represents a connection (edge) between two nodes.
 */
export interface WorkflowConnection {
    id: string;
    sourceId: string;
    targetId: string;
}
