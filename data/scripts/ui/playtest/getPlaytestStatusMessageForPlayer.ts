import type { Player } from "@minecraft/server";
import { TICKS_PER_SECOND } from "../../config/constants";
import { activeObjectives } from "../../state/activeObjectives";
import { nextTriggerTickByPlayer } from "../../state/nextTriggerTickByPlayer";
import { searchSequenceStartedTickByPlayerId } from "../../state/searchSequenceStartedTickByPlayerId";
import { currentTick } from "../../utils/time/currentTick";
import { getRerollItemCount } from "../../objective/reroll/getRerollItemCount";

const formatDurationFromTicks = (ticks: number): string => {
    const clampedTicks = ticks < 0 ? 0 : ticks;
    const totalSeconds = Math.floor(clampedTicks / TICKS_PER_SECOND);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const secondsText = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${secondsText}`;
};

export const getPlaytestStatusMessageForPlayer = (player: Player): string => {
    const nowTick = currentTick();
    const rerollCount = getRerollItemCount(player);
    const activeObjective = activeObjectives.get(player.id);
    const searchSequenceStartedTick = searchSequenceStartedTickByPlayerId.get(player.id);
    const searchSequenceElapsedTicks = searchSequenceStartedTick === undefined
        ? 0
        : Math.max(nowTick - searchSequenceStartedTick, 0);
    const searchSequenceElapsedText = formatDurationFromTicks(searchSequenceElapsedTicks);
    const searchSequenceStatusText = searchSequenceStartedTick === undefined ? "NO" : "YES";

    if (activeObjective) {
        const objectiveRemainingTicks = activeObjective.deadlineTick - nowTick;

        return [
            "[Wheel] Status",
            `Active objective: YES`,
            `Target: ${activeObjective.objective.displayName} x${activeObjective.requiredAmount}`,
            `Objective time left: ${formatDurationFromTicks(objectiveRemainingTicks)}`,
            `Search sequence active: ${searchSequenceStatusText}`,
            `Search sequence elapsed: ${searchSequenceElapsedText}`,
            `Reroll tokens: ${rerollCount}`
        ].join("\n");
    }

    const nextTriggerTick = nextTriggerTickByPlayer.get(player.id);
    const nextTriggerRemainingTicks = nextTriggerTick === undefined ? undefined : nextTriggerTick - nowTick;
    const nextTriggerText = nextTriggerRemainingTicks === undefined
        ? "unscheduled"
        : formatDurationFromTicks(nextTriggerRemainingTicks);

    return [
        "[Wheel] Status",
        "Active objective: NO",
        `Search sequence active: ${searchSequenceStatusText}`,
        `Search sequence elapsed: ${searchSequenceElapsedText}`,
        `Next trigger check: ${nextTriggerText}`,
        `Reroll tokens: ${rerollCount}`
    ].join("\n");
};