import { beginnerObjectiveCountByPlayerId } from "../../state/beginnerObjectiveCountByPlayerId";

export const setBeginnerObjectiveCount = (playerId: string, count: number): void => {
    if (!Number.isFinite(count)) {
        beginnerObjectiveCountByPlayerId.set(playerId, 0);
        return;
    }

    beginnerObjectiveCountByPlayerId.set(playerId, Math.max(0, Math.min(Math.floor(count), 3)));
};
