import { Player } from "@minecraft/server";
import { OBJECTIVE_GRACE_PERIOD_SECONDS, TICKS_PER_SECOND } from "../config/constants";
import { MESSAGE_WHEEL_SEARCH_SEQUENCE_STARTED_SELF } from "../config/messages";
import { currentTick } from "../utils/time/currentTick";
import type { ActiveObjective } from "../utils/types/ActiveObjective";
import { showFailureCinematicForPlayer } from "../ui/showFailureCinematicForPlayer";
import { clearObjectiveCountdown } from "../ui/showObjectiveCountdown";
import { clearObjectiveAndScheduleNextTrigger } from "./clearObjectiveAndScheduleNextTrigger";

export const resolveFailure = (player: Player, activeObjective: ActiveObjective): void => {
    if (!player.isValid) return;

    const graceStartTick = activeObjective.startedTick + OBJECTIVE_GRACE_PERIOD_SECONDS * TICKS_PER_SECOND;
    clearObjectiveAndScheduleNextTrigger(player.id, currentTick(), graceStartTick);
    clearObjectiveCountdown(player);
    player.sendMessage(MESSAGE_WHEEL_SEARCH_SEQUENCE_STARTED_SELF);
    showFailureCinematicForPlayer(player);
};
