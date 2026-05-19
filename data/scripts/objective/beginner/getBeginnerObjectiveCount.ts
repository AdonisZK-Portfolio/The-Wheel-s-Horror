import { beginnerObjectiveCountByPlayerId } from "../../state/beginnerObjectiveCountByPlayerId";

export const getBeginnerObjectiveCount = (playerId: string): number => {
    const count = beginnerObjectiveCountByPlayerId.get(playerId);
    if (count === undefined) return 0;
    return Math.min(count, 3);
};
