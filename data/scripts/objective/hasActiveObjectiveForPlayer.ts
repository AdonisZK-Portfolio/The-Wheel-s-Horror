import { activeObjectives } from "../state/activeObjectives";

export const hasActiveObjectiveForPlayer = (playerId: string): boolean => {
    return activeObjectives.has(playerId);
};
