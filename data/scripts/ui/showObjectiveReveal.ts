import type { Player } from "@minecraft/server";

export const showObjectiveReveal = (
    player: Player,
    displayName: string,
    requiredAmount: number
): void => {
    if (!player.isValid) return;

    player.onScreenDisplay.setTitle("§6Objective", {
        stayDuration: 40,
        fadeInDuration: 5,
        fadeOutDuration: 10,
        subtitle: requiredAmount <= 1
            ? `§eFind ${displayName}`
            : `§eFind ${requiredAmount} ${displayName}`
    });
};