import type { Player } from "@minecraft/server";
import { activeObjectives } from "../state/activeObjectives";
import { resolveSuccess } from "./resolveSuccess";

export const forceObjectiveSuccessForPlayer = (player: Player): boolean => {
    if (!player.isValid) return false;

    const activeObjective = activeObjectives.get(player.id);
    if (!activeObjective) return false;

    resolveSuccess(player, activeObjective);
    return true;
};