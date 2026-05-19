import type { ScriptEventHandlerContext } from "../scriptEventHandlerTypes";
import { rerollActiveObjectiveForPlayer } from "../../objective/rerollActiveObjectiveForPlayer";
import { sendRerollFailureMessage } from "../../objective/reroll/sendRerollFailureMessage";
import { MESSAGE_WHEEL_REROLL_TRIGGERED_SELF } from "../../config/messages";

export const handleRerollObjective = ({ player }: ScriptEventHandlerContext): void => {
    if (!player?.isValid) return;
    const result = rerollActiveObjectiveForPlayer(player);
    if (!result.ok) {
        sendRerollFailureMessage(player, result.reason);
        return;
    }
    player.sendMessage(MESSAGE_WHEEL_REROLL_TRIGGERED_SELF);
};
