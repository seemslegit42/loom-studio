/**
 * @fileOverview The unified Zustand store for Loom Studio.
 * This file brings together all the individual state slices (Avataris, Workflow, Audit)
 * into a single, cohesive store that can be accessed throughout the application via
 * the `useLoomStore` hook. This approach promotes modularity and scalability.
 */

import { create } from 'zustand';
import {
  type AvatarisSlice,
  createAvatarisSlice,
} from '@/lib/store/createAvatarisSlice';
import {
  type WorkflowSlice,
  createWorkflowSlice,
} from '@/lib/store/createWorkflowSlice';
import { type AuditSlice, createAuditSlice } from '@/lib/store/createAuditSlice';

/**
 * The master store for the Loom Studio application.
 * It combines multiple state slices into a single hook for easy access to state and actions.
 *
 * @example
 * const { agentPersona, setAgentPersona } = useLoomStore();
 * const { workflows, addWorkflow } = useLoomStore();
 * const { auditLog, logAction } = useLoomStore();
 */
export const useLoomStore = create<
  AvatarisSlice & WorkflowSlice & AuditSlice
>()((...a) => ({
  ...createAvatarisSlice(...a),
  ...createWorkflowSlice(...a),
  ...createAuditSlice(...a),
}));
