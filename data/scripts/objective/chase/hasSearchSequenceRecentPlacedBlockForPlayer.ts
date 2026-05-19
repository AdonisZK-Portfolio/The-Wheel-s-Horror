import { searchSequenceRecentPlacedBlockTickByLocationKeyByPlayerId } from "../../state/searchSequenceRecentPlacedBlockTickByLocationKeyByPlayerId";

export const hasSearchSequenceRecentPlacedBlockForPlayer = (
    playerId: string,
    locationKey: string,
    chaseStartTick: number
): boolean => {
    const placedTickByLocationKey = searchSequenceRecentPlacedBlockTickByLocationKeyByPlayerId.get(playerId);
    if (!placedTickByLocationKey) return false;

    const placedTick = placedTickByLocationKey.get(locationKey);
    if (placedTick === undefined) return false;

    return placedTick >= chaseStartTick;
};
