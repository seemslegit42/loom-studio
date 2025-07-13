/**
 * @fileoverview The Architect's Codex for Loom Studio.
 * This file serves as the single source of truth for all available workflow nodes,
 * their mythic names, descriptions, and technical metadata.
 */

import type { LucideIcon } from "lucide-react";
import {
  PlayCircle,
  Webhook,
  GitBranch,
  Hourglass,
  RefreshCw,
  Cpu,
  ScrollText,
  BarChart2,
  Languages,
  Tags,
  BotMessageSquare,
  Waypoints,
  Sparkles,
  GitMerge,
  Scissors,
  CheckCircle
} from "lucide-react";

export interface CodexNode {
    icon: LucideIcon;
    name: string;
    subtitle: string;
    tooltip: string;
    family: "Core" | "Logic" | "Agent" | "Connection";
    devLabel: string;
}

export const workflowNodeCodex: CodexNode[] = [
  // == CORE PANTHEON ==
  {
    icon: PlayCircle,
    name: "The Spark",
    subtitle: "Start a New Task",
    tooltip: "Kicks off an automation when you press \"run\" or at a scheduled time.",
    family: "Core",
    devLabel: "Manual Trigger"
  },
  {
    icon: CheckCircle,
    name: "The Seal",
    subtitle: "Finish the Task",
    tooltip: "Marks the end of the automation. The work is done.",
    family: "Core",
    devLabel: "End Node"
  },

  // == LOGIC PANTHEON ==
  {
    icon: Webhook,
    name: "The Signal",
    subtitle: "Start When Another App Acts",
    tooltip: "Listens for an action in another tool (like a new sale) to start the workflow.",
    family: "Logic",
    devLabel: "Webhook Listener"
  },
  {
    icon: GitBranch,
    name: "The Crossroads",
    subtitle: "Create an \"If/Then\" Choice",
    tooltip: "Sends the workflow down different paths based on a condition you set.",
    family: "Logic",
    devLabel: "Conditional Branch"
  },
  {
    icon: RefreshCw,
    name: "The Echo",
    subtitle: "Repeat for Each Item",
    tooltip: "Runs a set of actions for every single item in a list.",
    family: "Logic",
    devLabel: "For Each / Loop"
  },
  {
    icon: Hourglass,
    name: "The Vigil",
    subtitle: "Wait Until...",
    tooltip: "Pauses the workflow until a specific condition is met (e.g., payment confirmed).",
    family: "Logic",
    devLabel: "Wait Until"
  },

  // == AGENT PANTHEON ==
  {
    icon: ScrollText,
    name: "The Scribe",
    subtitle: "Draft Text",
    tooltip: "An AI Agent that writes emails, documents, or any other text.",
    family: "Agent",
    devLabel: "Text Generation Agent"
  },
  {
    icon: BarChart2,
    name: "The Analyst",
    subtitle: "Analyze & Sort Data",
    tooltip: "An AI Agent that categorizes information, finds patterns, or sorts lists.",
    family: "Agent",
    devLabel: "Data Analysis Agent"
  },
  
  // == CONNECTION PANTHEON ==
  {
    icon: Waypoints,
    name: "The Bridge",
    subtitle: "Connect to an Outside Tool",
    tooltip: "Pulls information from or sends commands to another application.",
    family: "Connection",
    devLabel: "API Call / HTTP Request"
  },
  {
    icon: Sparkles,
    name: "The Refiner",
    subtitle: "Clean Up & Format Data",
    tooltip: "Instantly cleans up messy data like names, dates, and numbers.",
    family: "Connection",
    devLabel: "Data Transform"
  },
  {
    icon: BotMessageSquare,
    name: "The Oracle",
    subtitle: "Ask the AI a Question",
    tooltip: "Get a direct answer, idea, or piece of knowledge from the core AI.",
    family: "Connection",
    devLabel: "Single-shot Prompt"
  },
];
