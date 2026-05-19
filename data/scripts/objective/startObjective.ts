import { Player } from "@minecraft/server";
import { activeObjectives } from "../state/activeObjectives";
import { beginnerObjectiveActivePlayerIds } from "../state/beginnerObjectiveActivePlayerIds";
import { getObjectiveForTier } from "./getObjectiveForTier";
import { getRandomObjective } from "./getRandomObjective";
import { incrementBeginnerObjectiveCount } from "./beginner/incrementBeginnerObjectiveCount";
import { isPlayerInBeginnerObjectiveWindow } from "./beginner/isPlayerInBeginnerObjectiveWindow";
import { startObjectiveWithDefinition } from "./startObjectiveWithDefinition";

export const startObjective = (player: Player): void => {
    if (!player.isValid) return;
    if (activeObjectives.has(player.id)) return;

    if (isPlayerInBeginnerObjectiveWindow(player.id)) {
        const beginnerObjective = getObjectiveForTier(player.id, "easy") ?? getRandomObjective(player.id);
        beginnerObjectiveActivePlayerIds.add(player.id);
        incrementBeginnerObjectiveCount(player.id);
        startObjectiveWithDefinition(player, beginnerObjective);
        return;
    }

    beginnerObjectiveActivePlayerIds.delete(player.id);
    const objective = getRandomObjective(player.id);
    startObjectiveWithDefinition(player, objective);
};
