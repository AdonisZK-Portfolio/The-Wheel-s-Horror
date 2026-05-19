import type { ScriptEventHandlerContext } from "../scriptEventHandlerTypes";
import { tryTriggerFootstepIllusionForPlayer } from "../../anomaly/tryTriggerFootstepIllusionForPlayer";
import { MESSAGE_WHEEL_ANOMALY_FOOTSTEP_FORCED_SELF } from "../../config/messages";
import { sendAnomalyTriggerResult } from "./sendAnomalyTriggerResult";

export const handleForceFootstepAnomaly = ({ player }: ScriptEventHandlerContext): void => {
    if (!player?.isValid) return;
    sendAnomalyTriggerResult(
        player,
        tryTriggerFootstepIllusionForPlayer(player),
        MESSAGE_WHEEL_ANOMALY_FOOTSTEP_FORCED_SELF
    );
};
