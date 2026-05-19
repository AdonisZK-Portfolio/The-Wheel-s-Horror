import type { ScriptEventHandlerContext } from "../scriptEventHandlerTypes";
import { activeObjectives } from "../../state/activeObjectives";
import { anomalyEventActiveUntilTickByPlayerId } from "../../state/anomalyEventActiveUntilTickByPlayerId";
import { searchSequenceStartedTickByPlayerId } from "../../state/searchSequenceStartedTickByPlayerId";
import { playerProgressionById } from "../../state/playerProgressionById";
import { getGameDifficulty } from "../../config/settings";
import { getRerollItemCount } from "../../objective/reroll/getRerollItemCount";
import { currentTick } from "../../utils/time/currentTick";
import { formatGddStatusMessage } from "../../config/messages";

const getUnlockedProgressionKeys = (playerId: string): readonly string[] => {
    const progression = playerProgressionById.get(playerId);
    if (!progression) return [];
    const keys: string[] = [];
    if (progression.hasReachedNether) keys.push("nether");
    if (progression.hasReachedJungle) keys.push("jungle");
    if (progression.hasReachedIronAge) keys.push("iron_age");
    if (progression.hasReachedDeepCave) keys.push("deep_cave");
    if (progression.hasReachedDiamondAge) keys.push("diamond_age");
    if (progression.hasBeatDragon) keys.push("end");
    if (progression.hasSilkTouch) keys.push("silk_touch");
    if (progression.hasUnlockedEnchanting) keys.push("enchanting");
    return keys;
};

export const handleGddStatus = ({ player }: ScriptEventHandlerContext): void => {
    if (!player?.isValid) return;

    const playerId = player.id;
    const nowTick = currentTick();
    const activeObjective = activeObjectives.get(playerId);
    const anomalyActiveUntilTick = anomalyEventActiveUntilTickByPlayerId.get(playerId);
    const isAnomalyActive = anomalyActiveUntilTick !== undefined && anomalyActiveUntilTick > nowTick;
    const isChaseActive = searchSequenceStartedTickByPlayerId.has(playerId);
    const rerollCount = getRerollItemCount(player);
    const difficulty = getGameDifficulty();
    const progressionKeys = getUnlockedProgressionKeys(playerId);

    const activeObjectiveLabel = activeObjective !== undefined
        ? `${activeObjective.objective.displayName} x${activeObjective.requiredAmount}`
        : undefined;

    player.sendMessage(formatGddStatusMessage(
        player.name,
        difficulty,
        activeObjective !== undefined,
        activeObjectiveLabel,
        isChaseActive,
        isAnomalyActive,
        rerollCount,
        progressionKeys
    ));
};
