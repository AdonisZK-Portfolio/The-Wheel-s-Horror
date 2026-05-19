import { getBeginnerObjectiveCount } from "./getBeginnerObjectiveCount";
import { setBeginnerObjectiveCount } from "./setBeginnerObjectiveCount";

export const incrementBeginnerObjectiveCount = (playerId: string): number => {
    const nextCount = getBeginnerObjectiveCount(playerId) + 1;
    setBeginnerObjectiveCount(playerId, nextCount);
    return getBeginnerObjectiveCount(playerId);
};
