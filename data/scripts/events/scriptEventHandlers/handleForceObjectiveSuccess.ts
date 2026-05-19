import type { ScriptEventHandlerContext } from "../scriptEventHandlerTypes";
import { forceObjectiveSuccessForPlayer } from "../../objective/forceObjectiveSuccessForPlayer";
import { MESSAGE_WHEEL_NO_ACTIVE_OBJECTIVE_SELF, MESSAGE_WHEEL_OBJECTIVE_SUCCESS_FORCED_SELF } from "../../config/messages";

export const handleForceObjectiveSuccess = ({ player }: ScriptEventHandlerContext): void => {
    if (!player?.isValid) return;
    if (!forceObjectiveSuccessForPlayer(player)) {
        player.sendMessage(MESSAGE_WHEEL_NO_ACTIVE_OBJECTIVE_SELF);
        return;
    }
    player.sendMessage(MESSAGE_WHEEL_OBJECTIVE_SUCCESS_FORCED_SELF);
};
