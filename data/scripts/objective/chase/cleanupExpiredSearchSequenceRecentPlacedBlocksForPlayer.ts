import {
    SEARCH_SEQUENCE_WHEEL_RECENT_BLOCK_MAX_AGE_SECONDS,
    TICKS_PER_SECOND
} from "../../config/constants";
import { searchSequenceRecentPlacedBlockTickByLocationKeyByPlayerId } from "../../state/searchSequenceRecentPlacedBlockTickByLocationKeyByPlayerId";

export const cleanupExpiredSearchSequenceRecentPlacedBlocksForPlayer = (playerId: string, currentTick: number): void => {
    const placedTickByLocationKey = searchSequenceRecentPlacedBlockTickByLocationKeyByPlayerId.get(playerId);
    if (!placedTickByLocationKey) return;

    const maxAgeTicks = SEARCH_SEQUENCE_WHEEL_RECENT_BLOCK_MAX_AGE_SECONDS * TICKS_PER_SECOND;

    for (const [locationKey, placedTick] of placedTickByLocationKey) {
        if (currentTick - placedTick <= maxAgeTicks) continue;
        placedTickByLocationKey.delete(locationKey);
    }

    if (placedTickByLocationKey.size > 0) return;
    searchSequenceRecentPlacedBlockTickByLocationKeyByPlayerId.delete(playerId);
};
