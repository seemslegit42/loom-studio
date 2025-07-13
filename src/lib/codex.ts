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
    family: "Core" | "Logic" | "Agent" | "Integration" | "Data";
    devLabel: string;
}

export const workflowNodeCodex: CodexNode[] = [
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
    icon: Tags,
    name: "The Organizer",
    subtitle: "Categorize and Tag Data",
    tooltip: "Sort inputs into categories or labels based on rules or AI logic.",
    family: "Agent",
    devLabel: "Tagging / Classification"
  },
  {
    icon: BotMessageSquare,
    name: "The Oracle",
    subtitle: "Ask the AI a Question",
    tooltip: "For when you need a direct answer or idea from the core AI. Just type your question and get a response.",
    family: "Agent",
    devLabel: "Single-shot Prompt"
  },
  {
    icon: Waypoints,
    name: "The Bridge",
    subtitle: "Connect to an Outside Tool",
    tooltip: "Pull information from or send commands to another application, like pulling customer data from your CRM or adding an event to your calendar.",
    family: "Integration",
    devLabel: "API Call / HTTP Request"
  },
  {
    icon: Sparkles,
    name: "The Refiner",
    subtitle: "Clean Up & Format Data",
    tooltip: "Instantly cleans up messy data. Use it to format names, fix dates, or combine fields.",
    family: "Data",
    devLabel: "Data Transform"
  },
  {
    icon: GitMerge,
    name: "The Conflux",
    subtitle: "Merge Multiple Data Streams",
    tooltip: "Combine inputs from several nodes into a single structured output.",
    family: "Data",
    devLabel: "Merge"
  },
  {
    icon: Scissors,
    name: "The Schism",
    subtitle: "Split Data into Parts",
    tooltip: "Break a dataset into separate chunks for routing or filtering.",
    family: "Data",
    devLabel: "Splitter"
  },
];
