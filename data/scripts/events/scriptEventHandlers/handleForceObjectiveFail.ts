import type { ScriptEventHandlerContext } from "../scriptEventHandlerTypes";
import { forceObjectiveFailureForPlayer } from "../../objective/forceObjectiveFailureForPlayer";
import { MESSAGE_WHEEL_NO_ACTIVE_OBJECTIVE_SELF, MESSAGE_WHEEL_OBJECTIVE_FAIL_FORCED_SELF } from "../../config/messages";

export const handleForceObjectiveFail = ({ player }: ScriptEventHandlerContext): void => {
    if (!player?.isValid) return;
    if (!forceObjectiveFailureForPlayer(player)) {
        player.sendMessage(MESSAGE_WHEEL_NO_ACTIVE_OBJECTIVE_SELF);
        return;
    }
    player.sendMessage(MESSAGE_WHEEL_OBJECTIVE_FAIL_FORCED_SELF);
};
