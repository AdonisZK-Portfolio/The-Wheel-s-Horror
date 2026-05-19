import {
    ANOMALY_EVENT_TRIGGER_CHANCE_OBJECTIVE_END_PER_MINUTE,
    ANOMALY_EVENT_TRIGGER_CHANCE_OBJECTIVE_START_PER_MINUTE,
    ANOMALY_EVENT_TRIGGER_CHANCE_OUTSIDE_OBJECTIVE_PER_MINUTE,
    SEARCH_SEQUENCE_ANOMALY_TRIGGER_CHANCE_END_PER_MINUTE,
    SEARCH_SEQUENCE_ANOMALY_TRIGGER_CHANCE_RAMP_SECONDS,
    SEARCH_SEQUENCE_ANOMALY_TRIGGER_CHANCE_START_PER_MINUTE,
    TICKS_PER_SECOND
} from "../config/constants";
import { activeObjectives } from "../state/activeObjectives";
import { searchSequenceStartedTickByPlayerId } from "../state/searchSequenceStartedTickByPlayerId";

const getSearchSequenceChancePerSecond = (playerId: string, currentTick: number): number | undefined => {
    const sequenceStartedTick = searchSequenceStartedTickByPlayerId.get(playerId);
    if (sequenceStartedTick === undefined) return undefined;

    const elapsedTicks = Math.max(currentTick - sequenceStartedTick, 0);
    const rampTicks = SEARCH_SEQUENCE_ANOMALY_TRIGGER_CHANCE_RAMP_SECONDS * TICKS_PER_SECOND;
    if (rampTicks <= 0) return SEARCH_SEQUENCE_ANOMALY_TRIGGER_CHANCE_END_PER_MINUTE / 60;

    const progress = Math.min(elapsedTicks / rampTicks, 1);
    const chancePerMinute = SEARCH_SEQUENCE_ANOMALY_TRIGGER_CHANCE_START_PER_MINUTE
        + (SEARCH_SEQUENCE_ANOMALY_TRIGGER_CHANCE_END_PER_MINUTE - SEARCH_SEQUENCE_ANOMALY_TRIGGER_CHANCE_START_PER_MINUTE) * progress;

    return chancePerMinute / 60;
};

export const getAnomalyTriggerChanceForPlayer = (playerId: string, currentTick: number): number => {
    const searchSequenceChance = getSearchSequenceChancePerSecond(playerId, currentTick);
    if (searchSequenceChance !== undefined) return searchSequenceChance;

    const activeObjective = activeObjectives.get(playerId);
    if (!activeObjective) return ANOMALY_EVENT_TRIGGER_CHANCE_OUTSIDE_OBJECTIVE_PER_MINUTE / 60;

    const totalTicks = activeObjective.deadlineTick - activeObjective.startedTick;
    if (totalTicks <= 0) return ANOMALY_EVENT_TRIGGER_CHANCE_OBJECTIVE_END_PER_MINUTE / 60;

    const elapsedTicks = currentTick - activeObjective.startedTick;
    if (elapsedTicks <= 0) return ANOMALY_EVENT_TRIGGER_CHANCE_OBJECTIVE_START_PER_MINUTE / 60;
    if (elapsedTicks >= totalTicks) return ANOMALY_EVENT_TRIGGER_CHANCE_OBJECTIVE_END_PER_MINUTE / 60;

    const progress = elapsedTicks / totalTicks;
    const chancePerMinute = ANOMALY_EVENT_TRIGGER_CHANCE_OBJECTIVE_START_PER_MINUTE
        + (ANOMALY_EVENT_TRIGGER_CHANCE_OBJECTIVE_END_PER_MINUTE - ANOMALY_EVENT_TRIGGER_CHANCE_OBJECTIVE_START_PER_MINUTE) * progress;

    return chancePerMinute / 60;
};
