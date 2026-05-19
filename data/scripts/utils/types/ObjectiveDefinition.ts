import type { ProgressionKey } from "./ProgressionKey";

export type ObjectiveAmountTier = "easy" | "medium" | "hard" | "very_hard";

export interface ObjectiveDefinition {
    readonly itemId: string;
    readonly displayName: string;
    readonly amountTier: ObjectiveAmountTier;
    readonly requiredKeys?: readonly ProgressionKey[];
}
