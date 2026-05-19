import type { ScriptEventHandlerContext } from "../scriptEventHandlerTypes";
import { MESSAGE_WHEEL_ANOMALY_ONE_TIME_RESET_SELF } from "../../config/messages";
import { resetTunnelOneTimeForPlaytest } from "./resetTunnelOneTimeForPlaytest";
import { resetEchoOneTimeForPlaytest } from "./resetEchoOneTimeForPlaytest";

export const handleResetOneTimeAnomalies = ({ player }: ScriptEventHandlerContext): void => {
    if (!player?.isValid) return;
    resetTunnelOneTimeForPlaytest(player.id);
    resetEchoOneTimeForPlaytest(player.id);
    player.sendMessage(MESSAGE_WHEEL_ANOMALY_ONE_TIME_RESET_SELF);
};
