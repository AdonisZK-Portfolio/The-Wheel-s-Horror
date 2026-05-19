import { OBJECTIVE_DURATION_SECONDS_BY_TIER } from "../config/constants";
import type { ObjectiveAmountTier } from "../utils/types/ObjectiveDefinition";

export const getObjectiveDurationSeconds = (amountTier: ObjectiveAmountTier): number => {
    return OBJECTIVE_DURATION_SECONDS_BY_TIER[amountTier];
};
