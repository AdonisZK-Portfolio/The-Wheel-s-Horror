import { world, type Player } from "@minecraft/server";
import {
    TICKS_PER_SECOND,
    OBJECTIVES
} from "../config/constants";
import { activeObjectives } from "../state/activeObjectives";
import { beginnerObjectiveActivePlayerIds } from "../state/beginnerObjectiveActivePlayerIds";
import { anomalyCooldownClearObjectiveStartTickByPlayerId } from "../state/anomalyCooldownClearObjectiveStartTickByPlayerId";
import { anomalyEventActiveUntilTickByPlayerId } from "../state/anomalyEventActiveUntilTickByPlayerId";
import { anomalyEventFakeJoinLeaveTriggeredPlayerIds } from "../state/anomalyEventFakeJoinLeaveTriggeredPlayerIds";
import { anomalyEventNextAllowedTickByPlayerId } from "../state/anomalyEventNextAllowedTickByPlayerId";
import { anomalyEventTunnelTriggeredPlayerIds } from "../state/anomalyEventTunnelTriggeredPlayerIds";
import { nextTriggerTickByPlayer } from "../state/nextTriggerTickByPlayer";
import { playerProgressionById } from "../state/playerProgressionById";
import { playtestDevStatusTrackedPlayerIds } from "../state/playtestDevStatusTrackedPlayerIds";
import { searchSequenceStartedTickByPlayerId } from "../state/searchSequenceStartedTickByPlayerId";
import { setBeginnerObjectiveCount } from "../objective/beginner/setBeginnerObjectiveCount";
import { currentTick } from "../utils/time/currentTick";
import type { ActiveObjective } from "../utils/types/ActiveObjective";
import { getObjectiveDurationSeconds } from "../objective/getObjectiveDurationSeconds";
import { getPlayerStatePropertyKey } from "../utils/playerState/getPlayerStatePropertyKey";

const parseNumberOrUndefined = (value: string | undefined): number | undefined => {
    if (!value) return undefined;
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return undefined;
    return parsed;
};

const getAdjustedRemainingTicks = (remainingTicks: number | undefined, elapsedTicks: number): number | undefined => {
    if (remainingTicks === undefined) return undefined;
    return Math.max(remainingTicks - elapsedTicks, 0);
};

const toActiveObjectiveFromEncoded = (
    encodedValue: string | undefined,
    nowTick: number,
    elapsedTicks: number
): ActiveObjective | undefined => {
    if (!encodedValue) return undefined;

    const encodedParts = encodedValue.split(",");
    if (encodedParts.length !== 4) return undefined;

    const itemId = encodedParts[0];
    const requiredAmount = parseNumberOrUndefined(encodedParts[1]);
    const deadlineRemainingTicks = parseNumberOrUndefined(encodedParts[2]);
    const revealRemainingTicks = parseNumberOrUndefined(encodedParts[3]);
    if (requiredAmount === undefined || deadlineRemainingTicks === undefined || revealRemainingTicks === undefined) return undefined;

    const objective = OBJECTIVES.find((candidate) => candidate.itemId === itemId);
    if (!objective) return undefined;

    const adjustedDeadlineRemainingTicks = getAdjustedRemainingTicks(deadlineRemainingTicks, elapsedTicks) ?? 0;
    const adjustedRevealRemainingTicks = getAdjustedRemainingTicks(revealRemainingTicks, elapsedTicks) ?? 0;

    const objectiveDurationTicks = getObjectiveDurationSeconds(objective.amountTier) * TICKS_PER_SECOND;
    const deadlineTick = nowTick + adjustedDeadlineRemainingTicks;
    const startedTick = deadlineTick - objectiveDurationTicks;

    return {
        objective,
        requiredAmount,
        startedTick,
        deadlineTick,
        revealTick: nowTick + adjustedRevealRemainingTicks
    };
};

const parseEncodedState = (encodedState: string): Map<string, string> => {
    const sections = encodedState.split("|");
    const stateByKey = new Map<string, string>();

    for (const section of sections) {
        const splitIndex = section.indexOf("=");
        if (splitIndex <= 0) continue;

        const key = section.slice(0, splitIndex);
        const value = section.slice(splitIndex + 1);
        if (!key) continue;
        stateByKey.set(key, value);
    }

    return stateByKey;
};

export const restorePlayerStateOnSpawn = (player: Player): void => {
    const dynamicPropertyKey = getPlayerStatePropertyKey(player.name);
    const encodedState = world.getDynamicProperty(dynamicPropertyKey);
    if (typeof encodedState !== "string") return;

    const parsedState = parseEncodedState(encodedState);

    const playerId = player.id;
    const nowTick = currentTick();

    const savedAtMs = parseNumberOrUndefined(parsedState.get("ts"));
    const elapsedMs = savedAtMs === undefined ? 0 : Math.max(Date.now() - savedAtMs, 0);
    const elapsedTicks = Math.floor(elapsedMs / 50);

    const activeObjective = toActiveObjectiveFromEncoded(parsedState.get("ao"), nowTick, elapsedTicks);
    if (activeObjective) {
        activeObjectives.set(playerId, activeObjective);

        if (parsedState.get("aw") === "1") {
            anomalyCooldownClearObjectiveStartTickByPlayerId.set(playerId, activeObjective.startedTick);
        }
    }

    const nextTriggerRemainingTicks = parseNumberOrUndefined(parsedState.get("nt"));
    const adjustedNextTriggerRemainingTicks = getAdjustedRemainingTicks(nextTriggerRemainingTicks, elapsedTicks);
    if (adjustedNextTriggerRemainingTicks !== undefined) {
        nextTriggerTickByPlayer.set(playerId, nowTick + adjustedNextTriggerRemainingTicks);
    }

    const encodedProgression = parsedState.get("pg");
    if (encodedProgression) {
        const progressionParts = encodedProgression.split(",");
        if (progressionParts.length === 8) {
            playerProgressionById.set(playerId, {
                hasReachedNether: progressionParts[0] === "1",
                hasReachedJungle: progressionParts[1] === "1",
                hasReachedIronAge: progressionParts[2] === "1",
                hasReachedDeepCave: progressionParts[3] === "1",
                hasReachedDiamondAge: progressionParts[4] === "1",
                hasBeatDragon: progressionParts[5] === "1",
                hasSilkTouch: progressionParts[6] === "1",
                hasUnlockedEnchanting: progressionParts[7] === "1"
            });
        }
    }

    const anomalyActiveRemainingTicks = parseNumberOrUndefined(parsedState.get("aa"));
    const adjustedAnomalyActiveRemainingTicks = getAdjustedRemainingTicks(anomalyActiveRemainingTicks, elapsedTicks);
    if (adjustedAnomalyActiveRemainingTicks !== undefined) {
        anomalyEventActiveUntilTickByPlayerId.set(playerId, nowTick + adjustedAnomalyActiveRemainingTicks);
    }

    const anomalyCooldownRemainingTicks = parseNumberOrUndefined(parsedState.get("ac"));
    const adjustedAnomalyCooldownRemainingTicks = getAdjustedRemainingTicks(anomalyCooldownRemainingTicks, elapsedTicks);
    if (adjustedAnomalyCooldownRemainingTicks !== undefined) {
        anomalyEventNextAllowedTickByPlayerId.set(playerId, nowTick + adjustedAnomalyCooldownRemainingTicks);
    }

    const beginnerObjectiveCount = parseNumberOrUndefined(parsedState.get("bc"));
    if (beginnerObjectiveCount !== undefined) {
        setBeginnerObjectiveCount(playerId, beginnerObjectiveCount);
    }

    if (activeObjective && parsedState.get("bw") === "1") {
        beginnerObjectiveActivePlayerIds.add(playerId);
    }

    const searchSequenceElapsedTicksAtSnapshot = parseNumberOrUndefined(parsedState.get("sq"));
    if (searchSequenceElapsedTicksAtSnapshot !== undefined) {
        const resumedSearchSequenceElapsedTicks = Math.max(searchSequenceElapsedTicksAtSnapshot + elapsedTicks, 0);
        searchSequenceStartedTickByPlayerId.set(playerId, nowTick - resumedSearchSequenceElapsedTicks);
    }

    if (parsedState.get("at") === "1") {
        anomalyEventTunnelTriggeredPlayerIds.add(playerId);
    }

    if (parsedState.get("aj") === "1") {
        anomalyEventFakeJoinLeaveTriggeredPlayerIds.add(playerId);
    }

    if (parsedState.get("dv") === "1") {
        playtestDevStatusTrackedPlayerIds.add(playerId);
    }
};
