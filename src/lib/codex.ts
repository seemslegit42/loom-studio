/**
 * @fileoverview The Architect's Codex for Loom Studio.
 * This file serves as the single source of truth for all available workflow nodes,
 * their mythic names, descriptions, and technical metadata.
 * This is the canonized "Law of Pantheons".
 */

import type { LucideIcon } from "lucide-react";
import {
  PlayCircle,
  Webhook,
  GitBranch,
  Hourglass,
  RefreshCw,
  ScrollText,
  BarChart2,
  Languages,
  BotMessageSquare,
  Waypoints,
  Sparkles,
  CheckCircle,
  Code,
  Cpu,
  FolderKanban,
  Shield,
  PencilRuler,
  BrainCircuit,
  Lightbulb,
  Link,
} from "lucide-react";

export interface CodexNode {
    icon: LucideIcon;
    name: string;
    subtitle: string;
    tooltip: string;
    family: "Core" | "Logic" | "Agent" | "Oracle" | "Connection" | "Data" | "Advanced" | "Archetype";
    devLabel: string;
}

export const workflowNodeCodex: CodexNode[] = [
  // == ARCHETYPE PANTHEON ==
  {
    icon: Lightbulb,
    name: "Oracle",
    subtitle: "The Seer of Possibilities",
    tooltip: "An agent that specializes in knowledge, synthesis, and providing insightful answers.",
    family: "Archetype",
    devLabel: "Archetype:Oracle"
  },
  {
    icon: Shield,
    name: "Sentinel",
    subtitle: "The Guardian of the Gates",
    tooltip: "An agent focused on security, validation, and enforcing rules.",
    family: "Archetype",
    devLabel: "Archetype:Sentinel"
  },
  {
    icon: PencilRuler,
    name: "Scribe",
    subtitle: "The Master of Words and Forms",
    tooltip: "An agent dedicated to content generation, summarization, and structured data output.",
    family: "Archetype",
    devLabel: "Archetype:Scribe"
  },
  {
    icon: BrainCircuit,
    name: "Trickster",
    subtitle: "The Weaver of Novel Solutions",
    tooltip: "An agent that excels at creative problem-solving, lateral thinking, and unconventional approaches.",
    family: "Archetype",
    devLabel: "Archetype:Trickster"
  },

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
    icon: Webhook,
    name: "The Signal",
    subtitle: "Start When Another App Acts",
    tooltip: "Listens for an action in another tool (like a new sale in Shopify or a new row in Google Sheets) and starts this workflow automatically.",
    family: "Core",
    devLabel: "Webhook Listener"
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
    icon: GitBranch,
    name: "The Crossroads",
    subtitle: "Create a Simple \"If/Then\"",
    tooltip: "Creates a fork in the road. If a condition is met (e.g., 'Is the customer a VIP?'), go down one path. If not, go down the other.",
    family: "Logic",
    devLabel: "Conditional Branch"
  },
   {
    icon: Hourglass,
    name: "The Vigil",
    subtitle: "Wait Until a Condition is Met",
    tooltip: "Pause the flow until a certain condition becomes true — like waiting for a payment to complete.",
    family: "Logic",
    devLabel: "Wait Until"
  },
  {
    icon: RefreshCw,
    name: "The Echo",
    subtitle: "Repeat for Each Item",
    tooltip: "Loops through a list — for example, send a message to each customer in a group.",
    family: "Logic",
    devLabel: "For Each / Loop"
  },

  // == AGENT PANTHEON ==
  {
    icon: Cpu,
    name: "The Agent",
    subtitle: "Give an AI a Job",
    tooltip: "Assign a specific task to your AI assistant, like summarizing text, writing an email, or sorting data into categories.",
    family: "Agent",
    devLabel: "LLM Task Agent"
  },
  {
    icon: ScrollText,
    name: "The Scribe",
    subtitle: "Write Something with AI",
    tooltip: "Ask your AI assistant to draft an email, document, or any piece of writing.",
    family: "Agent",
    devLabel: "Text Generation"
  },
  {
    icon: BarChart2,
    name: "The Analyst",
    subtitle: "Analyze Text or Data with AI",
    tooltip: "Use the AI to find trends, summarize datasets, or interpret customer feedback.",
    family: "Agent",
    devLabel: "Data Analysis"
  },
  {
    icon: Languages,
    name: "The Translator",
    subtitle: "Translate Language with AI",
    tooltip: "Translate content between languages automatically using the AI assistant.",
    family: "Agent",
    devLabel: "Language Translation"
  },
   {
    icon: FolderKanban,
    name: "The Organizer",
    subtitle: "Categorize and Tag Data",
    tooltip: "Sort inputs into categories or labels based on rules or AI logic.",
    family: "Agent",
    devLabel: "Tagging / Classification"
  },

  // == ORACLE PANTHEON ==
  {
    icon: BotMessageSquare,
    name: "The Oracle",
    subtitle: "Ask the AI a Question",
    tooltip: "For when you need a direct answer or idea from the core AI. Just type your question and get a response.",
    family: "Oracle",
    devLabel: "Single-shot Prompt"
  },
  
  // == CONNECTION PANTHEON ==
  {
    icon: Waypoints,
    name: "The Bridge",
    subtitle: "Connect to an Outside Tool",
    tooltip: "Pulls information from or sends commands to another application, like pulling customer data from your CRM or adding an event to your calendar.",
    family: "Connection",
    devLabel: "API Call / HTTP Request"
  },

  // == DATA PANTHEON ==
  {
    icon: Sparkles,
    name: "The Refiner",
    subtitle: "Clean Up & Format Data",
    tooltip: "Instantly cleans up messy data. Use it to format names, fix dates, or combine fields.",
    family: "Data",
    devLabel: "Data Transform"
  },

  // == ADVANCED PANTHEON ==
  {
    icon: Code,
    name: "The Raw Incantation",
    subtitle: "Execute Custom Code",
    tooltip: "Run your own script directly — powerful, but dangerous. Use only if you know the ancient tongue.",
    family: "Advanced",
    devLabel: "Custom JavaScript / Python"
  },
  {
    icon: Link,
    name: "Nexus",
    subtitle: "The Weaver of Voids",
    tooltip: "Summon a Nexus agent onto a connection to intelligently forge a new agent that bridges the gap between the source and target.",
    family: "Advanced",
    devLabel: "Nexus Agent"
  },
];
