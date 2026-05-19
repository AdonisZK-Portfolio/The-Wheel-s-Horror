import type { GuideEntry } from "./guidebookEntryTypes";
import { GUIDEBOOK_BODY_COLORS } from "./guidebookStyle";

const { danger, friendly, reset } = GUIDEBOOK_BODY_COLORS;

export const GUIDE_ENTRIES: readonly GuideEntry[] = [
    {
        id: "getting_started",
        title: "Getting Started",
        tier: "intro",
        role: "overview",
        description: `When ${danger}The Wheel${reset} lands on you, survival becomes a timed item hunt.`,
        requirements: [],
        compatibleMobs: [],
        icon: ">",
        color: "action",
        effect: "Covers the pressure cycle: spin, target, timer, pass, and fail.",
        action: "Read this first.",
        route: "show_getting_started"
    },
    {
        id: "objective_rules",
        title: "Objective Rules",
        tier: "core",
        role: "mechanics",
        description: "Objectives require a specific item before the timer ends. Storage locks and fresh gather rules limit your options.",
        requirements: [],
        compatibleMobs: [],
        icon: "*",
        color: "friendly",
        effect: "Covers valid progress, storage lock behavior, and source restrictions.",
        action: "Check here when the target appears.",
        route: "show_objective_rules"
    },
    {
        id: "rerolls",
        title: "Rerolls",
        tier: "core",
        role: "mechanics",
        description: "A Wheel Reroll Token lets you trade a bad target for a new one within the first minute.",
        requirements: ["Wheel Reroll Token in inventory", "Active objective within the first minute"],
        compatibleMobs: [],
        icon: "?",
        color: "success",
        effect: "Trades one objective for a new roll while the reroll window is open.",
        action: "Use the token within the first minute.",
        route: "show_rerolls"
    },
    {
        id: "difficulty_and_modes",
        title: "Difficulty and Modes",
        tier: "core",
        role: "settings",
        description: "Difficulty changes storage pressure, timers, and amount demands. Mode decides whether failure is personal, shared, or competitive.",
        requirements: [],
        compatibleMobs: [],
        icon: "?",
        color: "neutral",
        effect: "Compares Easy, Standard, Hard, Per Player, Team, and Battle.",
        action: "Set before the first objective.",
        route: "show_difficulty_and_modes"
    },
    {
        id: "anomalies",
        title: "Anomalies",
        tier: "core",
        role: "threat",
        description: `${friendly}Anomalies${reset} make the world feel wrong: doors shift, torches vanish, and footsteps lie.`,
        requirements: [],
        compatibleMobs: [],
        icon: "!",
        color: "warning",
        effect: "Teaches you to recognize strange events without abandoning the objective.",
        action: "Stay calm and keep chasing the target.",
        route: "show_anomalies"
    }
];
