import { OBJECTIVES } from "../config/constants";
import { isObjectiveItemBlacklisted } from "../config/objectiveItemBlacklist";
import { hasPlayerProgressionKey } from "./progression/hasPlayerProgressionKey";
import type { ObjectiveAmountTier, ObjectiveDefinition } from "../utils/types/ObjectiveDefinition";
import { randomInt } from "../utils/randomInt";

const hasRequiredKeys = (playerId: string, objective: ObjectiveDefinition): boolean => {
    const requiredKeys = objective.requiredKeys;
    if (!requiredKeys || requiredKeys.length === 0) return true;

    for (const requiredKey of requiredKeys) {
        if (!hasPlayerProgressionKey(playerId, requiredKey)) return false;
    }

    return true;
};

export const getObjectiveForTier = (playerId: string, tier: ObjectiveAmountTier): ObjectiveDefinition | undefined => {
    const eligibleObjectives = OBJECTIVES.filter((objective): boolean => {
        if (objective.amountTier !== tier) return false;
        if (isObjectiveItemBlacklisted(objective.itemId)) return false;
        return hasRequiredKeys(playerId, objective);
    });

    if (eligibleObjectives.length === 0) return undefined;
    const index = randomInt(0, eligibleObjectives.length - 1);
    return eligibleObjectives[index];
};
