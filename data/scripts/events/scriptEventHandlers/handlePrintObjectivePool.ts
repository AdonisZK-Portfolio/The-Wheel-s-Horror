import type { ScriptEventHandlerContext } from "../scriptEventHandlerTypes";
import { OBJECTIVES } from "../../config/constants";
import { isObjectiveItemBlacklisted } from "../../config/objectiveItemBlacklist";
import { hasPlayerProgressionKey } from "../../objective/progression/hasPlayerProgressionKey";
import type { ObjectiveAmountTier, ObjectiveDefinition } from "../../utils/types/ObjectiveDefinition";
import { formatObjectivePoolMessage } from "../../config/messages";

const isEligibleForPlayer = (playerId: string, objective: ObjectiveDefinition): boolean => {
    if (isObjectiveItemBlacklisted(objective.itemId)) return false;
    const requiredKeys = objective.requiredKeys;
    if (!requiredKeys || requiredKeys.length === 0) return true;
    for (const key of requiredKeys) {
        if (!hasPlayerProgressionKey(playerId, key)) return false;
    }
    return true;
};

export const handlePrintObjectivePool = ({ player }: ScriptEventHandlerContext): void => {
    if (!player?.isValid) return;

    const tierCounts: Record<ObjectiveAmountTier, number> = {
        easy: 0,
        medium: 0,
        hard: 0,
        very_hard: 0
    };

    let totalEligible = 0;

    for (const objective of OBJECTIVES) {
        if (!isEligibleForPlayer(player.id, objective)) continue;
        tierCounts[objective.amountTier]++;
        totalEligible++;
    }

    player.sendMessage(formatObjectivePoolMessage(
        player.name,
        tierCounts.easy,
        tierCounts.medium,
        tierCounts.hard,
        tierCounts.very_hard,
        totalEligible,
        OBJECTIVES.length
    ));
};
