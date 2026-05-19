import type { ScriptEventHandlerContext } from "../scriptEventHandlerTypes";
import { handleForceDoorAnomaly } from "./handleForceDoorAnomaly";
import { handleForceEchoAnomaly } from "./handleForceEchoAnomaly";
import { handleForceFootstepAnomaly } from "./handleForceFootstepAnomaly";
import { handleForceTorchAnomaly } from "./handleForceTorchAnomaly";
import { handleForceTreeAnomaly } from "./handleForceTreeAnomaly";
import { handleForceTunnelAnomaly } from "./handleForceTunnelAnomaly";
import { MESSAGE_WHEEL_FORCE_ANOMALY_INVALID_TYPE } from "../../config/messages";

export const handleForceAnomaly = (context: ScriptEventHandlerContext): void => {
    if (!context.player?.isValid) return;

    const anomalyType = context.message;

    if (anomalyType === "tree") {
        handleForceTreeAnomaly(context);
        return;
    }
    if (anomalyType === "tunnel") {
        handleForceTunnelAnomaly(context);
        return;
    }
    if (anomalyType === "footstep") {
        handleForceFootstepAnomaly(context);
        return;
    }
    if (anomalyType === "door") {
        handleForceDoorAnomaly(context);
        return;
    }
    if (anomalyType === "torch") {
        handleForceTorchAnomaly(context);
        return;
    }
    if (anomalyType === "echo") {
        handleForceEchoAnomaly(context);
        return;
    }

    context.player.sendMessage(MESSAGE_WHEEL_FORCE_ANOMALY_INVALID_TYPE);
};
