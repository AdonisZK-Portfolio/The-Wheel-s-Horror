import type { Player } from "@minecraft/server";
import { MESSAGE_WHEEL_ANOMALY_NOT_TRIGGERED_SELF } from "../../config/messages";

export const sendAnomalyTriggerResult = (player: Player, didTrigger: boolean, successMessage: string): void => {
    if (!didTrigger) {
        player.sendMessage(MESSAGE_WHEEL_ANOMALY_NOT_TRIGGERED_SELF);
        return;
    }
    player.sendMessage(successMessage);
};
