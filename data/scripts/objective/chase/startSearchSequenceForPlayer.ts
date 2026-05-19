import { system, type Player } from "@minecraft/server";
import { searchSequenceLastTeleportTickByPlayerId } from "../../state/searchSequenceLastTeleportTickByPlayerId";
import { searchSequenceStartedTickByPlayerId } from "../../state/searchSequenceStartedTickByPlayerId";
import { getOrSpawnSearchWheelForPlayer } from "./getOrSpawnSearchwheelForPlayer";

export const startSearchSequenceForPlayer = (player: Player): void => {
    if (!player.isValid) return;

    const nowTick = system.currentTick;
    const existingStartedTick = searchSequenceStartedTickByPlayerId.get(player.id);
    if (existingStartedTick === undefined) {
        searchSequenceStartedTickByPlayerId.set(player.id, nowTick);
        searchSequenceLastTeleportTickByPlayerId.set(player.id, nowTick);
    }

    getOrSpawnSearchWheelForPlayer(player);
};
