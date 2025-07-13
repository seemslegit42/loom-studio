/**
 * @fileOverview Centralized type definitions for the Loom Studio application.
 */

/**
 * Represents the data for a single node on the workflow canvas.
 */
export interface WorkflowNodeData {
    id: string;
    title: string;
    avatarDataUri: string | null;
    // Future properties: position, type, inputs, outputs, etc.
}
