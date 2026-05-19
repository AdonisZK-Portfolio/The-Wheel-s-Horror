import { OBJECTIVES } from "../config/constants";
import { isObjectiveItemBlacklisted } from "../config/objectiveItemBlacklist";
import { hasPlayerProgressionKey } from "../objective/progression/hasPlayerProgressionKey";
import type { ObjectiveAmountTier, ObjectiveDefinition } from "../utils/types/ObjectiveDefinition";
import { randomInt } from "../utils/randomInt";

const OBJECTIVE_TIERS: readonly ObjectiveAmountTier[] = ["easy", "medium", "hard", "very_hard"];

const OBJECTIVE_TIER_ROLL_WEIGHTS: Readonly<Record<ObjectiveAmountTier, number>> = {
    easy: 60,
    medium: 28,
    hard: 10,
    very_hard: 2
};

const hasRequiredKeys = (playerId: string, objective: ObjectiveDefinition): boolean => {
    const requiredKeys = objective.requiredKeys;
    if (!requiredKeys || requiredKeys.length === 0) return true;

    for (const requiredKey of requiredKeys) {
        if (!hasPlayerProgressionKey(playerId, requiredKey)) return false;
    }

    return true;
};

const getRandomObjectiveFromPool = (objectivePool: readonly ObjectiveDefinition[]): ObjectiveDefinition => {
    const index = randomInt(0, objectivePool.length - 1);
    return objectivePool[index];
};

const getWeightedTier = (objectivesByTier: Readonly<Record<ObjectiveAmountTier, ObjectiveDefinition[]>>): ObjectiveAmountTier | undefined => {
    let totalWeight = 0;

    for (const tier of OBJECTIVE_TIERS) {
        if (objectivesByTier[tier].length <= 0) continue;
        totalWeight += OBJECTIVE_TIER_ROLL_WEIGHTS[tier];
    }

    if (totalWeight <= 0) return undefined;

    const roll = randomInt(1, totalWeight);
    let currentWeight = 0;

    for (const tier of OBJECTIVE_TIERS) {
        if (objectivesByTier[tier].length <= 0) continue;

        currentWeight += OBJECTIVE_TIER_ROLL_WEIGHTS[tier];
        if (roll > currentWeight) continue;
        return tier;
    }

    return undefined;
};

export const getRandomObjective = (playerId: string): ObjectiveDefinition => {
    const availableObjectives = OBJECTIVES.filter((objective): boolean => {
        if (isObjectiveItemBlacklisted(objective.itemId)) return false;
        return hasRequiredKeys(playerId, objective);
    });

    const objectivePool = availableObjectives.length > 0 ? availableObjectives : OBJECTIVES;

    const objectivesByTier: Record<ObjectiveAmountTier, ObjectiveDefinition[]> = {
        easy: [],
        medium: [],
        hard: [],
        very_hard: []
    };

    for (const objective of objectivePool) {
        objectivesByTier[objective.amountTier].push(objective);
    }

    const selectedTier = getWeightedTier(objectivesByTier);
    if (!selectedTier) return getRandomObjectiveFromPool(objectivePool);

    const tierPool = objectivesByTier[selectedTier];
    if (tierPool.length <= 0) return getRandomObjectiveFromPool(objectivePool);

    return getRandomObjectiveFromPool(tierPool);
};
