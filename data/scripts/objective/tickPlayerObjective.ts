import { Player } from "@minecraft/server";
import { activeObjectives } from "../state/activeObjectives";
import { nextTriggerTickByPlayer } from "../state/nextTriggerTickByPlayer";
import { searchSequenceStartedTickByPlayerId } from "../state/searchSequenceStartedTickByPlayerId";
import { currentTick } from "../utils/time/currentTick";
import { showObjectiveCountdown } from "../ui/showObjectiveCountdown";
import { hasObjectiveItem } from "./hasObjectiveItem";
import { resolveFailure } from "./resolveFailure";
import { resolveSuccess } from "./resolveSuccess";
import { scheduleNextTrigger } from "./scheduleNextTrigger";
import { shouldStartObjectiveNow } from "./shouldStartObjectiveNow";
import { startObjective } from "./startObjective";

export const tickPlayerObjective = (player: Player): void => {
    if (!player.isValid) return;

    const nowTick = currentTick();
    const playerId = player.id;
    if (searchSequenceStartedTickByPlayerId.has(playerId)) return;

    const activeObjective = activeObjectives.get(playerId);

    if (!activeObjective) {
        const nextTriggerTick = nextTriggerTickByPlayer.get(playerId);
        if (nextTriggerTick === undefined) {
            scheduleNextTrigger(playerId, nowTick);
            return;
        }

        if (nowTick < nextTriggerTick) return;

        scheduleNextTrigger(playerId, nowTick);
        if (!shouldStartObjectiveNow()) return;

        startObjective(player);
        return;
    }

    if (
        hasObjectiveItem(
            player,
            activeObjective.objective.itemId,
            activeObjective.requiredAmount
        )
    ) {
        resolveSuccess(player, activeObjective);
        return;
    }

    if (nowTick >= activeObjective.revealTick) {
        showObjectiveCountdown(player, activeObjective, nowTick);
    }

    if (nowTick <= activeObjective.deadlineTick) return;
    resolveFailure(player, activeObjective);
};
