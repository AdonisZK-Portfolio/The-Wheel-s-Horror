import type { Player } from "@minecraft/server";
import { OBJECTIVE_START_BLINDNESS_SECONDS, TICKS_PER_SECOND } from "../config/constants";

export const showObjectiveStartCinematic = (player: Player): void => {
    if (!player.isValid) return;

    player.addEffect("minecraft:blindness", OBJECTIVE_START_BLINDNESS_SECONDS * TICKS_PER_SECOND, {
        amplifier: 0,
        showParticles: false
    });

    player.onScreenDisplay.setTitle("§5The Wheel Is Spinning", {
        stayDuration: 40,
        fadeInDuration: 5,
        fadeOutDuration: 10
    });
};