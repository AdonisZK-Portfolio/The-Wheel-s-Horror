import type { ScriptEventHandlerContext } from "../scriptEventHandlerTypes";
import {
    formatTunnelAnomalySearchStartedMessage,
    MESSAGE_WHEEL_ANOMALY_NOT_TRIGGERED_SELF,
    MESSAGE_WHEEL_ANOMALY_TUNNEL_FORCED_SELF
} from "../../config/messages";
import { ANOMALY_EVENT_ACTIVE_SECONDS } from "../../config/constants";
import { forceStartTunnelAnomalyForPlayer } from "../../anomaly/tryTriggerAnomalyEventForPlayer";
import { anomalyEventTunnelCoordinateRequestedPlayerIds } from "../../state/anomalyEventTunnelCoordinateRequestedPlayerIds";
import { anomalyEventTunnelSearchUntilTickByPlayerId } from "../../state/anomalyEventTunnelSearchUntilTickByPlayerId";
import { resetTunnelOneTimeForPlaytest } from "./resetTunnelOneTimeForPlaytest";

export const handleForceTunnelAnomaly = ({ player }: ScriptEventHandlerContext): void => {
    if (!player?.isValid) return;
    resetTunnelOneTimeForPlaytest(player.id);
    anomalyEventTunnelCoordinateRequestedPlayerIds.add(player.id);
    if (!forceStartTunnelAnomalyForPlayer(player)) {
        player.sendMessage(MESSAGE_WHEEL_ANOMALY_NOT_TRIGGERED_SELF);
        return;
    }
    player.sendMessage(MESSAGE_WHEEL_ANOMALY_TUNNEL_FORCED_SELF);
    if (anomalyEventTunnelSearchUntilTickByPlayerId.has(player.id)) {
        player.sendMessage(formatTunnelAnomalySearchStartedMessage(ANOMALY_EVENT_ACTIVE_SECONDS));
    }
};
