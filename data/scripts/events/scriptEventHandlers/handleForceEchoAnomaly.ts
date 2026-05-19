import type { ScriptEventHandlerContext } from "../scriptEventHandlerTypes";
import { tryTriggerFakeJoinLeaveEchoForPlayer } from "../../anomaly/tryTriggerFakeJoinLeaveEchoForPlayer";
import { MESSAGE_WHEEL_ANOMALY_ECHO_FORCED_SELF } from "../../config/messages";
import { sendAnomalyTriggerResult } from "./sendAnomalyTriggerResult";
import { resetEchoOneTimeForPlaytest } from "./resetEchoOneTimeForPlaytest";

export const handleForceEchoAnomaly = ({ player }: ScriptEventHandlerContext): void => {
    if (!player?.isValid) return;
    resetEchoOneTimeForPlaytest(player.id);
    sendAnomalyTriggerResult(
        player,
        tryTriggerFakeJoinLeaveEchoForPlayer(player),
        MESSAGE_WHEEL_ANOMALY_ECHO_FORCED_SELF
    );
};
