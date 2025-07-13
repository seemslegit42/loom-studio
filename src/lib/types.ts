
/**
 * @fileOverview Centralized type definitions for the Loom Studio application.
 */

import type { AnalyzeAgentProfileOutput } from "@/ai/flows/analyze-agent-profile-schema";

/**
 * Represents the data for a single node on the workflow canvas.
 */
export interface WorkflowNodeData {
    id: string;
    name: string;
    type: string; // Corresponds to devLabel from CodexNode
    avatarDataUri: string;
    dataAiHint?: string;
    profile: AnalyzeAgentProfileOutput['profile'];
    position: { x: number; y: number; };
    prompt: string;
    // Future properties: inputs, outputs, etc.
}


/**
 * Represents a connection (edge) between two nodes.
 */
export interface WorkflowConnection {
    id: string;
    sourceId: string;
    targetId: string;
}
