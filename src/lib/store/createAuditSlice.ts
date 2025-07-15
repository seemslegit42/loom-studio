
/**
 * @fileOverview Zustand slice for the immutable audit log.
 * This slice provides a simple, append-only log of significant user actions
 * within the Loom Studio, complete with timestamps and metadata for traceability.
 */

import type { StateCreator } from 'zustand';
import type { AvatarisSlice } from './createAvatarisSlice';
import type { WorkflowSlice } from './createWorkflowSlice';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  metadata: Record<string, any>;
}

export interface AuditSlice {
  auditLog: AuditLogEntry[];
  logAction: (action: string, metadata?: Record<string, any>) => void;
  selectedLogId: string | null;
  isTimelineOpen: boolean;
  selectLogEntry: (log: AuditLogEntry | null) => void;
  toggleTimeline: () => void;
}

const initialState = {
  auditLog: [
      {
          id: `log_${crypto.randomUUID()}`,
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
      id: `log_${crypto.randomUUID()}`,
      timestamp: new Date().toISOString(),
      userId: 'Architect-001', // Placeholder
      action,
      metadata,
    };
    set((state) => ({ auditLog: [newEntry, ...state.auditLog] }));
  },
  selectLogEntry: (log) => set({ selectedLogId: log ? log.id : null }),
  toggleTimeline: () => set(state => ({ isTimelineOpen: !state.isTimelineOpen })),
});
