export type GuideTier = "intro" | "core" | "tester";

export type GuideRole = "overview" | "mechanics" | "settings" | "threat" | "debug";

export type GuideColor = "danger" | "warning" | "success" | "friendly" | "locked" | "neutral" | "action";

export type GuideRoute =
    | "show_getting_started"
    | "show_objective_rules"
    | "show_rerolls"
    | "show_difficulty_and_modes"
    | "show_anomalies";

export interface GuideEntry {
    readonly id: string;
    readonly title: string;
    readonly tier: GuideTier;
    readonly role: GuideRole;
    readonly description: string;
    readonly requirements: readonly string[];
    readonly compatibleMobs: readonly string[];
    readonly icon: string;
    readonly color: GuideColor;
    readonly effect: string;
    readonly action: string;
    readonly route: GuideRoute;
}
