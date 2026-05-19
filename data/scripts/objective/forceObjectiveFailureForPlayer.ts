import type { Player } from "@minecraft/server";
import { activeObjectives } from "../state/activeObjectives";
import { resolveFailure } from "./resolveFailure";

export const forceObjectiveFailureForPlayer = (player: Player): boolean => {
    if (!player.isValid) return false;

    const activeObjective = activeObjectives.get(player.id);
    if (!activeObjective) return false;

    resolveFailure(player, activeObjective);
    return true;
};