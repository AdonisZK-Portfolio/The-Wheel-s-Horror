import type { ScriptEventHandlerContext } from "../scriptEventHandlerTypes";
import { forceTriggerAnomalyEventForPlayer } from "../../anomaly/tryTriggerAnomalyEventForPlayer";
import { MESSAGE_WHEEL_ANOMALY_TREE_FORCED_SELF } from "../../config/messages";
import { sendAnomalyTriggerResult } from "./sendAnomalyTriggerResult";

export const handleForceTreeAnomaly = ({ player }: ScriptEventHandlerContext): void => {
    if (!player?.isValid) return;
    sendAnomalyTriggerResult(
        player,
        forceTriggerAnomalyEventForPlayer(player),
        MESSAGE_WHEEL_ANOMALY_TREE_FORCED_SELF
    );
};
