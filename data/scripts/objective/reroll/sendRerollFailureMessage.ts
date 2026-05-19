import type { Player } from "@minecraft/server";
import {
    MESSAGE_REROLL_EMPTY,
    MESSAGE_REROLL_LOCKED,
    MESSAGE_REROLL_NO_ACTIVE_OBJECTIVE
} from "../../config/messages";
import type { RerollFailureReason } from "./RerollAttemptResult";

export const sendRerollFailureMessage = (player: Player, reason: RerollFailureReason): void => {
    if (reason === "no_active_objective") {
        player.sendMessage(MESSAGE_REROLL_NO_ACTIVE_OBJECTIVE);
        return;
    }

    if (reason === "locked") {
        player.sendMessage(MESSAGE_REROLL_LOCKED);
        return;
    }

    player.sendMessage(MESSAGE_REROLL_EMPTY);
};
