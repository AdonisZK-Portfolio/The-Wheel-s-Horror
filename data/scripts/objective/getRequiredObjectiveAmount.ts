import type { ObjectiveDefinition } from "../utils/types/ObjectiveDefinition";
import type { ObjectiveAmountTier } from "../utils/types/ObjectiveDefinition";
import { getGameDifficulty } from "../config/settings";
import { randomInt } from "../utils/randomInt";

const HARD_DIFFICULTY_MAX_REQUIRED_AMOUNT_BY_TIER: Readonly<Record<ObjectiveAmountTier, number>> = {
    easy: 16,
    medium: 8,
    hard: 4,
    very_hard: 1
};

export const getRequiredObjectiveAmount = (objective: ObjectiveDefinition): number => {
    const currentDifficulty = getGameDifficulty();
    if (currentDifficulty !== "hard") return 1;

    const maxRequiredAmount = HARD_DIFFICULTY_MAX_REQUIRED_AMOUNT_BY_TIER[objective.amountTier];
    return randomInt(1, maxRequiredAmount);
};
