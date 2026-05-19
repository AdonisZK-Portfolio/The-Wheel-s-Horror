import type { Player } from "@minecraft/server";
import { REROLL_SPIN_BLINDNESS_SECONDS, TICKS_PER_SECOND } from "../config/constants";

export const showRerollSpinCinematic = (player: Player): void => {
    if (!player.isValid) return;

    player.addEffect("minecraft:blindness", REROLL_SPIN_BLINDNESS_SECONDS * TICKS_PER_SECOND, {
        amplifier: 0,
        showParticles: false
    });

    player.onScreenDisplay.setTitle("§5The Wheel Is Spinning", {
        stayDuration: 70,
        fadeInDuration: 5,
        fadeOutDuration: 10,
        subtitle: "§dFate is being rewritten"
    });
};