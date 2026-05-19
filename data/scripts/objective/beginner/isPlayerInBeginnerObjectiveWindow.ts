import { getBeginnerObjectiveCount } from "./getBeginnerObjectiveCount";

export const isPlayerInBeginnerObjectiveWindow = (playerId: string): boolean => {
    return getBeginnerObjectiveCount(playerId) < 3;
};
