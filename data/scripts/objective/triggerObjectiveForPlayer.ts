import { Player } from "@minecraft/server";
import { activeObjectives } from "../state/activeObjectives";
import { startObjective } from "./startObjective";

export const triggerObjectiveForPlayer = (player: Player): void => {
    if (!player.isValid) return;
    activeObjectives.delete(player.id);
    startObjective(player);
};
