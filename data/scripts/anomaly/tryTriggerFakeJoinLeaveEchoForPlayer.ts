import type { Player } from "@minecraft/server";
import { anomalyEventFakeJoinLeaveTriggeredPlayerIds } from "../state/anomalyEventFakeJoinLeaveTriggeredPlayerIds";

export const tryTriggerFakeJoinLeaveEchoForPlayer = (player: Player): boolean => {
    if (!player.isValid) return false;
    if (anomalyEventFakeJoinLeaveTriggeredPlayerIds.has(player.id)) return false;

    player.sendMessage("§eSteve left the game");
    anomalyEventFakeJoinLeaveTriggeredPlayerIds.add(player.id);

    return true;
};
