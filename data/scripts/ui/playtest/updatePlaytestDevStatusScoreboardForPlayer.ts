import {
    DisplaySlotId,
    ObjectiveSortOrder,
    type Player,
    world
} from "@minecraft/server";
import {
    OBJECTIVE_GRACE_PERIOD_SECONDS,
    SEARCH_SEQUENCE_ANOMALY_TRIGGER_CHANCE_END_PER_MINUTE,
    SEARCH_SEQUENCE_ANOMALY_TRIGGER_CHANCE_RAMP_SECONDS,
    SEARCH_SEQUENCE_ANOMALY_TRIGGER_CHANCE_START_PER_MINUTE,
    TICKS_PER_SECOND
} from "../../config/constants";
import { getRerollItemCount } from "../../objective/reroll/getRerollItemCount";
import { activeObjectives } from "../../state/activeObjectives";
import { anomalyEventActiveUntilTickByPlayerId } from "../../state/anomalyEventActiveUntilTickByPlayerId";
import { anomalyEventNextAllowedTickByPlayerId } from "../../state/anomalyEventNextAllowedTickByPlayerId";
import { nextTriggerTickByPlayer } from "../../state/nextTriggerTickByPlayer";
import { searchSequenceStartedTickByPlayerId } from "../../state/searchSequenceStartedTickByPlayerId";
import { currentTick } from "../../utils/time/currentTick";

const DEV_SCOREBOARD_OBJECTIVE_ID = "wheel_dev";
const DEV_SCOREBOARD_OBJECTIVE_DISPLAY_NAME = "Wheel Dev Status";
let hasClearedLegacyEntries = false;

const getTicksLeft = (targetTick: number | undefined, nowTick: number): number => {
    if (targetTick === undefined) return -1;
    return Math.max(targetTick - nowTick, 0);
};

const ticksToWholeSeconds = (ticks: number): number => {
    if (ticks < 0) return -1;
    return Math.floor(ticks / TICKS_PER_SECOND);
};

const getSearchSequenceChancePerMinute = (elapsedTicks: number): number => {
    const rampTicks = SEARCH_SEQUENCE_ANOMALY_TRIGGER_CHANCE_RAMP_SECONDS * TICKS_PER_SECOND;
    if (rampTicks <= 0) return SEARCH_SEQUENCE_ANOMALY_TRIGGER_CHANCE_END_PER_MINUTE;

    const progress = Math.min(Math.max(elapsedTicks, 0) / rampTicks, 1);
    return SEARCH_SEQUENCE_ANOMALY_TRIGGER_CHANCE_START_PER_MINUTE
        + (SEARCH_SEQUENCE_ANOMALY_TRIGGER_CHANCE_END_PER_MINUTE - SEARCH_SEQUENCE_ANOMALY_TRIGGER_CHANCE_START_PER_MINUTE) * progress;
};

const getOrCreateObjective = () => {
    return world.scoreboard.getObjective(DEV_SCOREBOARD_OBJECTIVE_ID)
        ?? world.scoreboard.addObjective(DEV_SCOREBOARD_OBJECTIVE_ID, DEV_SCOREBOARD_OBJECTIVE_DISPLAY_NAME);
};

const clearAllObjectiveParticipants = (): void => {
    const objective = getOrCreateObjective();
    const participants = objective.getParticipants();
    for (const participant of participants) {
        objective.removeParticipant(participant);
    }
};

const setMetricScore = (metricName: string, score: number): void => {
    const objective = world.scoreboard.getObjective(DEV_SCOREBOARD_OBJECTIVE_ID)
        ?? world.scoreboard.addObjective(DEV_SCOREBOARD_OBJECTIVE_ID, DEV_SCOREBOARD_OBJECTIVE_DISPLAY_NAME);

    objective.setScore(metricName, score);
};

const showDevObjectiveInSidebar = (): void => {
    const objective = world.scoreboard.getObjective(DEV_SCOREBOARD_OBJECTIVE_ID)
        ?? world.scoreboard.addObjective(DEV_SCOREBOARD_OBJECTIVE_ID, DEV_SCOREBOARD_OBJECTIVE_DISPLAY_NAME);

    world.scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.Sidebar, {
        objective,
        sortOrder: ObjectiveSortOrder.Descending
    });
};

export const clearPlaytestDevStatusScoreboard = (): void => {
    const objective = world.scoreboard.getObjective(DEV_SCOREBOARD_OBJECTIVE_ID);
    if (objective) {
        const participants = objective.getParticipants();
        for (const participant of participants) {
            objective.removeParticipant(participant);
        }
    }

    const sidebar = world.scoreboard.getObjectiveAtDisplaySlot(DisplaySlotId.Sidebar);
    if (sidebar?.objective.id === DEV_SCOREBOARD_OBJECTIVE_ID) {
        world.scoreboard.clearObjectiveAtDisplaySlot(DisplaySlotId.Sidebar);
    }

    hasClearedLegacyEntries = false;
};

export const updatePlaytestDevStatusScoreboardForPlayer = (player: Player): void => {
    if (!player.isValid) return;

    if (!hasClearedLegacyEntries) {
        clearAllObjectiveParticipants();
        hasClearedLegacyEntries = true;
    }

    const nowTick = currentTick();
    const activeObjective = activeObjectives.get(player.id);

    const anomalyActiveUntilTick = anomalyEventActiveUntilTickByPlayerId.get(player.id);
    const anomalyNextAllowedTick = anomalyEventNextAllowedTickByPlayerId.get(player.id);
    const nextTriggerTick = nextTriggerTickByPlayer.get(player.id);
    const searchSequenceStartedTick = searchSequenceStartedTickByPlayerId.get(player.id);
    const objectiveDeadlineTick = activeObjective?.deadlineTick;
    const objectiveRevealTick = activeObjective?.revealTick;

    const graceEndTick = activeObjective
        ? activeObjective.startedTick + OBJECTIVE_GRACE_PERIOD_SECONDS * TICKS_PER_SECOND
        : nextTriggerTick;

    const anomalyActiveLeftTicks = getTicksLeft(anomalyActiveUntilTick, nowTick);
    const anomalyCooldownLeftTicks = getTicksLeft(anomalyNextAllowedTick, nowTick);
    const nextTriggerLeftTicks = getTicksLeft(nextTriggerTick, nowTick);
    const graceLeftTicks = getTicksLeft(graceEndTick, nowTick);
    const searchSequenceElapsedTicks = searchSequenceStartedTick === undefined
        ? 0
        : Math.max(nowTick - searchSequenceStartedTick, 0);
    const searchSequenceChancePerMinute = searchSequenceStartedTick === undefined
        ? 0
        : getSearchSequenceChancePerMinute(searchSequenceElapsedTicks);
    const objectiveLeftTicks = activeObjective ? getTicksLeft(objectiveDeadlineTick, nowTick) : 0;
    const objectiveRevealLeftTicks = activeObjective ? getTicksLeft(objectiveRevealTick, nowTick) : 0;

    setMetricScore("search active", searchSequenceStartedTick === undefined ? 0 : 1);
    setMetricScore("search elapsed s", ticksToWholeSeconds(searchSequenceElapsedTicks));
    setMetricScore("search anomaly chance %", Math.round(searchSequenceChancePerMinute * 100));
    setMetricScore("objective active", activeObjective ? 1 : 0);
    setMetricScore("objective left s", ticksToWholeSeconds(objectiveLeftTicks));
    setMetricScore("objective reveal left s", ticksToWholeSeconds(objectiveRevealLeftTicks));
    setMetricScore("grace block left s", ticksToWholeSeconds(graceLeftTicks));
    setMetricScore("anomaly active", anomalyActiveLeftTicks > 0 ? 1 : 0);
    setMetricScore("anomaly active left s", ticksToWholeSeconds(anomalyActiveLeftTicks));
    setMetricScore("anomaly cooldown left s", ticksToWholeSeconds(anomalyCooldownLeftTicks));
    setMetricScore("next trigger left s", ticksToWholeSeconds(nextTriggerLeftTicks));
    setMetricScore("reroll tokens", getRerollItemCount(player));

    showDevObjectiveInSidebar();
};
