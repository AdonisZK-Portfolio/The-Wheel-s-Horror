import type { ScriptEventHandlerContext } from "../scriptEventHandlerTypes";
import { stopSearchSequenceForPlayer } from "../../objective/chase/stopSearchSequenceForPlayer";
import { MESSAGE_WHEEL_PLAYTEST_WHEEL_STOPPED_SELF } from "../../config/messages";

export const handleStopWheelChase = ({ player }: ScriptEventHandlerContext): void => {
    if (!player?.isValid) return;
    stopSearchSequenceForPlayer(player.id);
    player.sendMessage(MESSAGE_WHEEL_PLAYTEST_WHEEL_STOPPED_SELF);
};
