
import { AnalyzeAgentProfileOutput } from "@/ai/flows/analyze-agent-profile-flow";

type AgentProfile = AnalyzeAgentProfileOutput['profile'];

// Initial state values
export const INITIAL_AVATAR = 'https://placehold.co/100x100.png';
export const INITIAL_NAME = 'Prometheus-7';
export const INITIAL_PROFILE: AgentProfile = [
  { "trait": "Creativity", "value": 50 },
  { "trait": "Humor", "value": 50 },
  { "trait": "Formality", "value": 50 },
  { "trait": "Enthusiasm", "value": 50 },
  { "trait": "Technicality", "value": 50 },
  { "trait": "Whimsy", "value": 50 }
];
export const INITIAL_ORIGINAL_PROMPT = 'You are a helpful assistant.';
export const INITIAL_MODIFIED_PROMPT = 'You are a witty and sarcastic space pirate captain assistant, an expert in puns and dad jokes, who always refers to the user as "Commander". You have a pet space monkey named Zorp.';
