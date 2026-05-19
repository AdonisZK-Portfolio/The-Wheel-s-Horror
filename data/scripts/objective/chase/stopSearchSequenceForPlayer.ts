import { searchSequenceWheelEntityIdByPlayerId } from "../../state/searchSequencewheelEntityIdByPlayerId";
import { searchSequenceWheelIsCrawlingByPlayerId } from "../../state/searchSequencewheelIsCrawlingByPlayerId";
import { searchSequenceNextAttackTickByPlayerId } from "../../state/searchSequenceNextAttackTickByPlayerId";
import { searchSequenceStartedTickByPlayerId } from "../../state/searchSequenceStartedTickByPlayerId";
import { searchSequenceLastTeleportTickByPlayerId } from "../../state/searchSequenceLastTeleportTickByPlayerId";
import { clearSearchWheelEntitiesForPlayerId } from "./clearSearchwheelEntitiesForPlayerId";
import { clearSearchSequenceRecentPlacedBlocksForPlayer } from "./clearSearchSequenceRecentPlacedBlocksForPlayer";

export const stopSearchSequenceForPlayer = (playerId: string): void => {
    searchSequenceStartedTickByPlayerId.delete(playerId);
    searchSequenceWheelEntityIdByPlayerId.delete(playerId);
    searchSequenceWheelIsCrawlingByPlayerId.delete(playerId);
    searchSequenceNextAttackTickByPlayerId.delete(playerId);
    searchSequenceLastTeleportTickByPlayerId.delete(playerId);
    clearSearchSequenceRecentPlacedBlocksForPlayer(playerId);
    clearSearchWheelEntitiesForPlayerId(playerId);
};
