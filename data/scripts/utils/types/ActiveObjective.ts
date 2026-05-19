import type { ObjectiveDefinition } from "./ObjectiveDefinition";

export interface ActiveObjective {
    readonly objective: ObjectiveDefinition;
    readonly requiredAmount: number;
    readonly startedTick: number;
    readonly deadlineTick: number;
    readonly revealTick: number;
}
