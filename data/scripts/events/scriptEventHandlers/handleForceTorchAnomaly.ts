import type { ScriptEventHandlerContext } from "../scriptEventHandlerTypes";
import { tryTriggerTorchRemovalForPlayer } from "../../anomaly/tryTriggerTorchRemovalForPlayer";
import { MESSAGE_WHEEL_ANOMALY_TORCH_FORCED_SELF } from "../../config/messages";
import { sendAnomalyTriggerResult } from "./sendAnomalyTriggerResult";

export const handleForceTorchAnomaly = ({ player }: ScriptEventHandlerContext): void => {
    if (!player?.isValid) return;
    sendAnomalyTriggerResult(
        player,
        tryTriggerTorchRemovalForPlayer(player),
        MESSAGE_WHEEL_ANOMALY_TORCH_FORCED_SELF
    );
};
