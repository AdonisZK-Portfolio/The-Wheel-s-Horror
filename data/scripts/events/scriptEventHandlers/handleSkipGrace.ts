import type { ScriptEventHandlerContext } from "../scriptEventHandlerTypes";
import {
    MESSAGE_WHEEL_GRACE_SKIP_ACTIVE_OBJECTIVE_SELF,
    MESSAGE_WHEEL_GRACE_SKIPPED_SELF
} from "../../config/messages";
import { activeObjectives } from "../../state/activeObjectives";
import { nextTriggerTickByPlayer } from "../../state/nextTriggerTickByPlayer";
import { currentTick } from "../../utils/time/currentTick";

export const handleSkipGrace = ({ player }: ScriptEventHandlerContext): void => {
    if (!player?.isValid) return;

    const playerId = player.id;
    if (activeObjectives.has(playerId)) {
        player.sendMessage(MESSAGE_WHEEL_GRACE_SKIP_ACTIVE_OBJECTIVE_SELF);
        return;
    }

    nextTriggerTickByPlayer.set(playerId, currentTick());
    player.sendMessage(MESSAGE_WHEEL_GRACE_SKIPPED_SELF);
};
