import type { ScriptEventHandlerContext } from "../scriptEventHandlerTypes";
import { triggerObjectiveForPlayer } from "../../objective/triggerObjectiveForPlayer";
import { MESSAGE_WHEEL_OBJECTIVE_FORCED_SELF } from "../../config/messages";

export const handleTestObjective = ({ player }: ScriptEventHandlerContext): void => {
    if (!player?.isValid) return;
    triggerObjectiveForPlayer(player);
    player.sendMessage(MESSAGE_WHEEL_OBJECTIVE_FORCED_SELF);
};
