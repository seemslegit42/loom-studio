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
    avatarDataUri: string | null;
    profile: AnalyzeAgentProfileOutput['profile'];
    // Future properties: position, type, inputs, outputs, etc.
}
