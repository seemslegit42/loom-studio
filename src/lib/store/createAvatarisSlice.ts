/**
 * @fileOverview Zustand slice for the Avataris Genesis Engine.
 * This slice manages the entire state for the agent creation and avatar
 * forging process, from defining the agent's persona to generating,
 * refining, and certifying its unique avatar.
 */

import type { StateCreator } from 'zustand';
import type {
  AgentPersona,
  AvatarDraft,
  AvatarisState,
  AegisCertification,
  AvatarStyle,
  AegisCertificationStatus,
} from './types';
import type { WorkflowSlice } from './createWorkflowSlice';
import type { AuditSlice } from './createAuditSlice';

export interface AvatarisSlice {
  avataris: AvatarisState;
  setAgentPersona: (persona: AgentPersona) => void;
  startAvatarGeneration: (style: AvatarStyle) => void;
  setAvatarDraft: (imageDataUri: string) => void;
  addRefinementCommand: (command: string) => void;
  submitForCertification: () => void;
  setCertificationResult: (
    status: AegisCertificationStatus,
    reason?: string
  ) => void;
  finalizeAvatar: () => void;
  reforgeAvatar: () => void;
  resetAvataris: () => void;
}

const initialState: AvatarisState = {
  forgingStatus: 'Idle',
  currentPersona: null,
  currentDraft: null,
  certification: null,
};

export const createAvatarisSlice: StateCreator<
  AvatarisSlice & WorkflowSlice & AuditSlice,
  [],
  [],
  AvatarisSlice
> = (set, get) => ({
  avataris: initialState,

  setAgentPersona: (persona) => {
    set((state) => ({
      avataris: {
        ...state.avataris,
        currentPersona: persona,
        forgingStatus: 'Defining',
      },
    }));
    get().logAction('PERSONA_DEFINED', { personaArchetype: persona.archetype });
  },

  startAvatarGeneration: (style) => {
    if (!get().avataris.currentPersona) return;
    set((state) => ({
      avataris: {
        ...state.avataris,
        forgingStatus: 'Generating',
        currentDraft: {
          imageDataUri: '',
          style,
          refinementCommands: [],
        },
        certification: null,
      },
    }));
    get().logAction('AVATAR_GENERATION_STARTED', { style });
  },

  setAvatarDraft: (imageDataUri) => {
    set((state) => {
      if (!state.avataris.currentDraft) return {};
      return {
        avataris: {
          ...state.avataris,
          forgingStatus: 'Refining',
          currentDraft: { ...state.avataris.currentDraft, imageDataUri },
        },
      };
    });
  },

  addRefinementCommand: (command) => {
    set((state) => {
      if (!state.avataris.currentDraft) return {};
      return {
        avataris: {
          ...state.avataris,
          forgingStatus: 'Generating', // Go back to generating a new version
          currentDraft: {
            ...state.avataris.currentDraft,
            refinementCommands: [
              ...state.avataris.currentDraft.refinementCommands,
              command,
            ],
          },
        },
      };
    });
    get().logAction('AVATAR_REFINEMENT_COMMAND_ADDED', { command });
  },

  submitForCertification: () => {
    if (!get().avataris.currentDraft?.imageDataUri) return;
    set((state) => ({
      avataris: {
        ...state.avataris,
        forgingStatus: 'Certifying',
        certification: { status: 'Pending' },
      },
    }));
    get().logAction('AVATAR_SUBMITTED_FOR_CERTIFICATION');
  },

  setCertificationResult: (status, reason) => {
    const signature = status === 'Certified' ? `aegis-sig-${crypto.randomUUID()}` : undefined;
    set((state) => ({
      avataris: {
        ...state.avataris,
        forgingStatus: status === 'Certified' ? 'Complete' : 'Failed',
        certification: { status, reason, signature },
      },
    }));
    get().logAction(`AVATAR_CERTIFICATION_${status.toUpperCase()}`, { reason, signature });
  },

  finalizeAvatar: () => {
    // This action would typically trigger creating a new agent in the workflow slice
    // or updating an existing one. That logic lives outside the store.
    console.log('Finalizing avatar and binding to agent...');
    get().logAction('AVATAR_FINALIZED');
    // After finalization, reset the state
    get().resetAvataris();
  },

  reforgeAvatar: () => {
    const currentDraft = get().avataris.currentDraft;
    if (!currentDraft) return;
    set((state) => ({
      avataris: {
        ...state.avataris,
        forgingStatus: 'Generating',
        certification: null,
      },
    }));
    get().logAction('AVATAR_REFORGE_INITIATED');
  },

  resetAvataris: () => {
    set({ avataris: initialState });
  },
});
