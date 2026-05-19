import {
    CREATURE_SPAWN_CHANCE_CHASE_PER_MINUTE,
    CREATURE_SPAWN_CHANCE_QUEST_PHASE_1_PER_MINUTE,
    CREATURE_SPAWN_CHANCE_QUEST_PHASE_2_PER_MINUTE,
    CREATURE_SPAWN_CHANCE_QUEST_PHASE_3_PER_MINUTE,
    CREATURE_SPAWN_PHASE_2_START_SECONDS,
    CREATURE_SPAWN_PHASE_3_START_SECONDS,
    TICKS_PER_SECOND
} from "../config/constants";
import { activeObjectives } from "../state/activeObjectives";
import { searchSequenceStartedTickByPlayerId } from "../state/searchSequenceStartedTickByPlayerId";

export const getCreatureSpawnChancePerSecond = (playerId: string, currentTick: number): number => {
    if (searchSequenceStartedTickByPlayerId.has(playerId)) {
        return CREATURE_SPAWN_CHANCE_CHASE_PER_MINUTE / 60;
    }

    const activeObjective = activeObjectives.get(playerId);
    if (!activeObjective) return 0;

    const elapsedSeconds = (currentTick - activeObjective.startedTick) / TICKS_PER_SECOND;

    if (elapsedSeconds >= CREATURE_SPAWN_PHASE_3_START_SECONDS) {
        return CREATURE_SPAWN_CHANCE_QUEST_PHASE_3_PER_MINUTE / 60;
    }
    if (elapsedSeconds >= CREATURE_SPAWN_PHASE_2_START_SECONDS) {
        return CREATURE_SPAWN_CHANCE_QUEST_PHASE_2_PER_MINUTE / 60;
    }
    return CREATURE_SPAWN_CHANCE_QUEST_PHASE_1_PER_MINUTE / 60;
};
