
/**
 * @fileOverview Zustand slice for the immutable audit log.
 * This slice provides a simple, append-only log of significant user actions
 * within the Loom Studio, complete with timestamps and metadata for traceability.
 */

import type { StateCreator } from 'zustand';
import type { AuditLogEntry } from './types';
import type { AvatarisSlice } from './createAvatarisSlice';
import type { WorkflowSlice } from './createWorkflowSlice';


export interface AuditSlice {
  auditLog: AuditLogEntry[];
  logAction: (action: string, metadata?: Record<string, any>) => void;
  selectedLogId: string | null;
  isTimelineOpen: boolean;
  selectLogEntry: (logId: string | null) => void;
  toggleTimeline: () => void;
}

const initialState = {
  auditLog: [
      {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          userId: 'Architect-001',
          action: 'SESSION_STARTED',
          metadata: { message: "Welcome to the Architect's Table." },
      }
  ],
  selectedLogId: null,
  isTimelineOpen: false,
};

export const createAuditSlice: StateCreator<
  AuditSlice & AvatarisSlice & WorkflowSlice,
  [],
  [],
  AuditSlice
> = (set, get) => ({
  ...initialState,
  logAction: (action, metadata = {}) => {
    const newEntry: AuditLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      userId: 'Architect-001', // Placeholder
      action,
      metadata,
    };
    set((state) => ({ auditLog: [newEntry, ...state.auditLog] }));
  },
  selectLogEntry: (logId) => set({ selectedLogId: logId }),
  toggleTimeline: () => set(state => ({ isTimelineOpen: !state.isTimelineOpen })),
});
