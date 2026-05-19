import { system, type Block, type Player } from "@minecraft/server";
import { cleanupExpiredSearchSequenceRecentPlacedBlocksForPlayer } from "./cleanupExpiredSearchSequenceRecentPlacedBlocksForPlayer";
import { getOrCreateSearchSequenceRecentPlacedBlockTickByLocationKeyForPlayer } from "./getOrCreateSearchSequenceRecentPlacedBlockTickByLocationKeyForPlayer";
import { getBlockLocationKey } from "../../anomaly/getBlockLocationKey";

export const trackSearchSequencePlacedBlock = (player: Player, block: Block | undefined): void => {
    if (!player.isValid) return;
    if (!block) return;

    const currentTick = system.currentTick;
    cleanupExpiredSearchSequenceRecentPlacedBlocksForPlayer(player.id, currentTick);

    const locationKey = getBlockLocationKey(block.dimension.id, block.location);
    const placedTickByLocationKey = getOrCreateSearchSequenceRecentPlacedBlockTickByLocationKeyForPlayer(player.id);
    placedTickByLocationKey.set(locationKey, currentTick);
};
