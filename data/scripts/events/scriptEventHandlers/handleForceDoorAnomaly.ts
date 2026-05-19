import type { ScriptEventHandlerContext } from "../scriptEventHandlerTypes";
import { triggerDoorMemoryGlitchForPlayer } from "../../anomaly/tryTriggerDoorMemoryGlitchForPlayer";
import {
    formatDoorAnomalyCoordinateMessage,
    MESSAGE_WHEEL_ANOMALY_DOOR_FORCED_SELF,
    MESSAGE_WHEEL_ANOMALY_NOT_TRIGGERED_SELF
} from "../../config/messages";

export const handleForceDoorAnomaly = ({ player }: ScriptEventHandlerContext): void => {
    if (!player?.isValid) return;
    const doorLocation = triggerDoorMemoryGlitchForPlayer(player);
    if (!doorLocation) {
        player.sendMessage(MESSAGE_WHEEL_ANOMALY_NOT_TRIGGERED_SELF);
        return;
    }
    player.sendMessage(MESSAGE_WHEEL_ANOMALY_DOOR_FORCED_SELF);
    player.sendMessage(
        formatDoorAnomalyCoordinateMessage(doorLocation.x, doorLocation.y, doorLocation.z)
    );
};
