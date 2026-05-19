import { searchSequenceRecentPlacedBlockTickByLocationKeyByPlayerId } from "../../state/searchSequenceRecentPlacedBlockTickByLocationKeyByPlayerId";

export const clearSearchSequenceRecentPlacedBlocksForPlayer = (playerId: string): void => {
    searchSequenceRecentPlacedBlockTickByLocationKeyByPlayerId.delete(playerId);
};
