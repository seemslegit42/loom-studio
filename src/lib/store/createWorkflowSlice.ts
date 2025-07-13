/**
 * @fileOverview Zustand slice for the Loom Studio workflow management.
 * This slice handles the state for creating, editing, and managing
 * agentic workflows on the Loom of Fates canvas.
 */

import type { StateCreator } from 'zustand';
import type { Workflow, WorkflowNode, WorkflowConnection } from './types';
import type { AvatarisSlice } from './createAvatarisSlice';
import type { AuditSlice } from './createAuditSlice';


export interface WorkflowSlice {
  workflows: Record<string, Workflow>;
  selectedWorkflowId: string | null;
  addWorkflow: (workflow: Workflow) => void;
  updateWorkflow: (workflowId: string, updates: Partial<Workflow>) => void;
  selectWorkflow: (workflowId: string | null) => void;
  addNodeToWorkflow: (workflowId: string, node: WorkflowNode) => void;
}

const initialState = {
  workflows: {},
  selectedWorkflowId: null,
};

export const createWorkflowSlice: StateCreator<
  WorkflowSlice & AvatarisSlice & AuditSlice,
  [],
  [],
  WorkflowSlice
> = (set, get) => ({
  ...initialState,

  addWorkflow: (workflow) => {
    set((state) => ({
      workflows: { ...state.workflows, [workflow.id]: workflow },
    }));
    get().logAction('WORKFLOW_ADDED', { workflowId: workflow.id, name: workflow.name });
  },

  updateWorkflow: (workflowId, updates) => {
    set((state) => {
      const workflow = state.workflows[workflowId];
      if (!workflow) return {};
      return {
        workflows: {
          ...state.workflows,
          [workflowId]: { ...workflow, ...updates },
        },
      };
    });
    get().logAction('WORKFLOW_UPDATED', { workflowId, updates: Object.keys(updates) });
  },

  selectWorkflow: (workflowId) => {
    set({ selectedWorkflowId: workflowId });
    if(workflowId) {
      get().logAction('WORKFLOW_SELECTED', { workflowId });
    }
  },

  addNodeToWorkflow: (workflowId, node) => {
    set((state) => {
      const workflow = state.workflows[workflowId];
      if (!workflow) return {};
      return {
        workflows: {
          ...state.workflows,
          [workflowId]: { ...workflow, nodes: [...workflow.nodes, node] },
        },
      };
    });
     get().logAction('NODE_ADDED_TO_WORKFLOW', { workflowId, nodeId: node.id });
  },
});
