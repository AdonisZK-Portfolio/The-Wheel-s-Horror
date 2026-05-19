import { Player } from "@minecraft/server";
import { OBJECTIVE_GRACE_PERIOD_SECONDS, TICKS_PER_SECOND } from "../config/constants";
import { currentTick } from "../utils/time/currentTick";
import type { ActiveObjective } from "../utils/types/ActiveObjective";
import { clearObjectiveCountdown } from "../ui/showObjectiveCountdown";
import { clearObjectiveAndScheduleNextTrigger } from "./clearObjectiveAndScheduleNextTrigger";

export const resolveSuccess = (player: Player, activeObjective: ActiveObjective): void => {
    if (!player.isValid) return;

    const graceStartTick = activeObjective.startedTick + OBJECTIVE_GRACE_PERIOD_SECONDS * TICKS_PER_SECOND;
    clearObjectiveAndScheduleNextTrigger(player.id, currentTick(), graceStartTick);
    clearObjectiveCountdown(player);
    player.onScreenDisplay.setTitle("§aObjective Complete", {
        stayDuration: 30,
        fadeInDuration: 3,
        fadeOutDuration: 8,
        subtitle: `§f${activeObjective.objective.displayName}`
    });
};
