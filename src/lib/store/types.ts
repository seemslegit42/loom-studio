/**
 * @fileOverview Canonical type definitions for the Loom Studio Zustand store.
 * This file serves as the single source of truth for the data structures
 * used across all state management slices.
 */

// =================================
// Core Entities
// =================================

export type AgentArchetype = 'Oracle' | 'Sentinel' | 'Scribe' | 'Trickster';
export type AvatarStyle =
  | 'AETHER-GLASS'
  | 'OBSIDIAN-SIGIL'
  | 'GILDED-AUTOMATA'
  | 'VERDIGRIS-RUNE';
export type AvatarBehavioralState = 'Idle' | 'Executing' | 'Error';
export type WorkflowStatus = 'Draft' | 'Staging' | 'Production';
export type AegisCertificationStatus = 'Pending' | 'Certified' | 'Rejected';

/**
 * The DNA of an agent, defining its core identity before it is forged.
 */
export interface AgentPersona {
  archetype: AgentArchetype;
  traitMatrix: Record<string, number>; // e.g., { "Stoic": 70, "Creative": 90 }
  functionalKeywords: string[]; // e.g., ["Data-Weaver", "Security-Enforcer"]
  prompt: string;
}

/**
 * The visual and behavioral representation of an agent.
 */
export interface Avatar {
  id: string;
  imageDataUri: string; // base64 or SVG data URI
  style: AvatarStyle;
  behavioralState: AvatarBehavioralState;
  provenanceSignature: string; // Aegis-signed hash
  generationHistory: string[]; // Prompts/commands used for refinement
}

/**
 * Represents a single node on the workflow canvas.
 */
export interface WorkflowNode {
  id: string;
  agentId: string; // The ID of the agent this node represents
  position: { x: number; y: number };
}

/**
 * Represents a connection between two nodes on the workflow canvas.
 */
export interface WorkflowConnection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
}

/**
 * A complete, self-contained agentic workflow.
 */
export interface Workflow {
  id: string;
  name: string;
  status: WorkflowStatus;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
}

/**
 * An entry in the immutable audit log.
 */
export interface AuditLogEntry {
  id: string;
  timestamp: string; // ISO 8601 format
  userId: string; // Placeholder for user ID
  action: string; // e.g., "WORKFLOW_DEPLOYED", "AVATAR_CERTIFIED"
  metadata: Record<string, any>;
}

// =================================
// State for Avataris Genesis Engine
// =================================

export type ForgingStatus =
  | 'Idle'
  | 'Defining'
  | 'Generating'
  | 'Refining'
  | 'Certifying'
  | 'Failed'
  | 'Complete';

export interface AvatarDraft {
  imageDataUri: string;
  style: AvatarStyle;
  refinementCommands: string[];
}

export interface AegisCertification {
  status: AegisCertificationStatus;
  reason?: string; // Provided on rejection
  signature?: string;
}

export interface AvatarisState {
  forgingStatus: ForgingStatus;
  currentPersona: AgentPersona | null;
  currentDraft: AvatarDraft | null;
  certification: AegisCertification | null;
}
