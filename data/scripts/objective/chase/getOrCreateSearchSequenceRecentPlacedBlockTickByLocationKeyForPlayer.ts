import { searchSequenceRecentPlacedBlockTickByLocationKeyByPlayerId } from "../../state/searchSequenceRecentPlacedBlockTickByLocationKeyByPlayerId";

export const getOrCreateSearchSequenceRecentPlacedBlockTickByLocationKeyForPlayer = (playerId: string): Map<string, number> => {
    const existing = searchSequenceRecentPlacedBlockTickByLocationKeyByPlayerId.get(playerId);
    if (existing) return existing;

    const created = new Map<string, number>();
    searchSequenceRecentPlacedBlockTickByLocationKeyByPlayerId.set(playerId, created);
    return created;
};
