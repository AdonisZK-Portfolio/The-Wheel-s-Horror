import type { Player } from "@minecraft/server";
import { TICKS_PER_SECOND } from "../config/constants";
import { getRerollItemCount } from "../objective/reroll/getRerollItemCount";
import type { ActiveObjective } from "../utils/types/ActiveObjective";

export const showObjectiveCountdown = (player: Player, activeObjective: ActiveObjective, nowTick: number): void => {
    if (!player.isValid) return;

    const remainingTicks = activeObjective.deadlineTick - nowTick;
    if (remainingTicks < 0) return;

    const seconds = Math.floor(remainingTicks / TICKS_PER_SECOND);
    const minutes = Math.floor(seconds / 60);
    const secondsPart = seconds % 60;
    const secondsText = secondsPart < 10 ? `0${secondsPart}` : `${secondsPart}`;
    const rerollTokenCount = getRerollItemCount(player);

    player.onScreenDisplay.setActionBar(
        `Objective: ${activeObjective.objective.displayName} x${activeObjective.requiredAmount} | Time: ${minutes}:${secondsText} | Tokens: ${rerollTokenCount}`
    );
};

export const clearObjectiveCountdown = (player: Player): void => {
    if (!player.isValid) return;
    player.onScreenDisplay.setActionBar("");
};