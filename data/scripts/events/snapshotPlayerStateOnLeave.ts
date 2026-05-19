import { system, world, type Player } from "@minecraft/server";
import { activeObjectives } from "../state/activeObjectives";
import { beginnerObjectiveActivePlayerIds } from "../state/beginnerObjectiveActivePlayerIds";
import { beginnerObjectiveCountByPlayerId } from "../state/beginnerObjectiveCountByPlayerId";
import { anomalyCooldownClearObjectiveStartTickByPlayerId } from "../state/anomalyCooldownClearObjectiveStartTickByPlayerId";
import { anomalyEventActiveUntilTickByPlayerId } from "../state/anomalyEventActiveUntilTickByPlayerId";
import { anomalyEventFakeJoinLeaveTriggeredPlayerIds } from "../state/anomalyEventFakeJoinLeaveTriggeredPlayerIds";
import { anomalyEventNextAllowedTickByPlayerId } from "../state/anomalyEventNextAllowedTickByPlayerId";
import { anomalyEventTunnelCoordinateRequestedPlayerIds } from "../state/anomalyEventTunnelCoordinateRequestedPlayerIds";
import { anomalyEventTunnelChunkTrackingInitializedPlayerIds } from "../state/anomalyEventTunnelChunkTrackingInitializedPlayerIds";
import { anomalyEventTunnelNewlyLoadedChunkKeysByPlayerId } from "../state/anomalyEventTunnelNewlyLoadedChunkKeysByPlayerId";
import { anomalyEventTunnelSearchUntilTickByPlayerId } from "../state/anomalyEventTunnelSearchUntilTickByPlayerId";
import { anomalyEventTunnelSeenChunkKeysByPlayerId } from "../state/anomalyEventTunnelSeenChunkKeysByPlayerId";
import { anomalyEventTunnelTriggeredPlayerIds } from "../state/anomalyEventTunnelTriggeredPlayerIds";
import { nextTriggerTickByPlayer } from "../state/nextTriggerTickByPlayer";
import { playerProgressionById } from "../state/playerProgressionById";
import { playtestDevStatusTrackedPlayerIds } from "../state/playtestDevStatusTrackedPlayerIds";
import { searchSequenceWheelEntityIdByPlayerId } from "../state/searchSequencewheelEntityIdByPlayerId";
import { searchSequenceWheelIsCrawlingByPlayerId } from "../state/searchSequencewheelIsCrawlingByPlayerId";
import { searchSequenceNextAttackTickByPlayerId } from "../state/searchSequenceNextAttackTickByPlayerId";
import { searchSequenceRecentPlacedBlockTickByLocationKeyByPlayerId } from "../state/searchSequenceRecentPlacedBlockTickByLocationKeyByPlayerId";
import { searchSequenceStartedTickByPlayerId } from "../state/searchSequenceStartedTickByPlayerId";
import { clearSearchWheelEntitiesForPlayerId } from "../objective/chase/clearSearchwheelEntitiesForPlayerId";
import { searchSequenceLastTeleportTickByPlayerId } from "../state/searchSequenceLastTeleportTickByPlayerId";
import { getBeginnerObjectiveCount } from "../objective/beginner/getBeginnerObjectiveCount";
import { currentTick } from "../utils/time/currentTick";
import { getPlayerStatePropertyKey } from "../utils/playerState/getPlayerStatePropertyKey";

const getRemainingTicks = (targetTick: number | undefined, nowTick: number): number | undefined => {
    if (targetTick === undefined) return undefined;
    return Math.max(targetTick - nowTick, 0);
};

export const savePlayerStateSnapshot = (player: Player): void => {
    const playerId = player.id;
    const nowTick = currentTick();

    const activeObjective = activeObjectives.get(playerId);
    const nextTriggerTick = nextTriggerTickByPlayer.get(playerId);
    const progression = playerProgressionById.get(playerId);
    const anomalyActiveUntilTick = anomalyEventActiveUntilTickByPlayerId.get(playerId);
    const anomalyNextAllowedTick = anomalyEventNextAllowedTickByPlayerId.get(playerId);
    const anomalyCooldownClearObjectiveStartTick = anomalyCooldownClearObjectiveStartTickByPlayerId.get(playerId);
    const hasTunnelTriggered = anomalyEventTunnelTriggeredPlayerIds.has(playerId);
    const hasFakeJoinLeaveTriggered = anomalyEventFakeJoinLeaveTriggeredPlayerIds.has(playerId);
    const devStatusTracked = playtestDevStatusTrackedPlayerIds.has(playerId) ? 1 : 0;
    const searchSequenceStartedTick = searchSequenceStartedTickByPlayerId.get(playerId);
    const beginnerObjectiveCount = getBeginnerObjectiveCount(playerId);
    const beginnerObjectiveActive = beginnerObjectiveActivePlayerIds.has(playerId) ? 1 : 0;

    const sections: string[] = [
        "v=1",
        `ts=${Date.now()}`
    ];

    if (activeObjective) {
        const objectiveDeadlineRemainingTicks = getRemainingTicks(activeObjective.deadlineTick, nowTick) ?? 0;
        const objectiveRevealRemainingTicks = getRemainingTicks(activeObjective.revealTick, nowTick) ?? 0;
        sections.push(
            `ao=${activeObjective.objective.itemId},${activeObjective.requiredAmount},${objectiveDeadlineRemainingTicks},${objectiveRevealRemainingTicks}`
        );
    }

    const nextTriggerRemainingTicks = getRemainingTicks(nextTriggerTick, nowTick);
    if (nextTriggerRemainingTicks !== undefined) {
        sections.push(`nt=${nextTriggerRemainingTicks}`);
    }

    if (progression) {
        sections.push(
            `pg=${progression.hasReachedNether ? 1 : 0},${progression.hasReachedJungle ? 1 : 0},${progression.hasReachedIronAge ? 1 : 0},${progression.hasReachedDeepCave ? 1 : 0},${progression.hasReachedDiamondAge ? 1 : 0},${progression.hasBeatDragon ? 1 : 0},${progression.hasSilkTouch ? 1 : 0},${progression.hasUnlockedEnchanting ? 1 : 0}`
        );
    }

    const anomalyActiveRemainingTicks = getRemainingTicks(anomalyActiveUntilTick, nowTick);
    if (anomalyActiveRemainingTicks !== undefined) {
        sections.push(`aa=${anomalyActiveRemainingTicks}`);
    }

    const anomalyNextAllowedRemainingTicks = getRemainingTicks(anomalyNextAllowedTick, nowTick);
    if (anomalyNextAllowedRemainingTicks !== undefined) {
        sections.push(`ac=${anomalyNextAllowedRemainingTicks}`);
    }

    if (searchSequenceStartedTick !== undefined) {
        const searchSequenceElapsedTicks = Math.max(nowTick - searchSequenceStartedTick, 0);
        sections.push(`sq=${searchSequenceElapsedTicks}`);
    }

    if (activeObjective && anomalyCooldownClearObjectiveStartTick === activeObjective.startedTick) {
        sections.push("aw=1");
    }

    if (beginnerObjectiveCount > 0) {
        sections.push(`bc=${beginnerObjectiveCount}`);
    }

    if (activeObjective && beginnerObjectiveActive > 0) {
        sections.push("bw=1");
    }

    if (hasTunnelTriggered) {
        sections.push("at=1");
    }

    if (hasFakeJoinLeaveTriggered) {
        sections.push("aj=1");
    }

    if (devStatusTracked > 0) {
        sections.push(`dv=${devStatusTracked}`);
    }

    const dynamicPropertyKey = getPlayerStatePropertyKey(player.name);
    world.setDynamicProperty(dynamicPropertyKey, sections.join("|"));
};

export const snapshotPlayerStateOnLeave = (player: Player): void => {
    const playerId = player.id;
    savePlayerStateSnapshot(player);

    activeObjectives.delete(playerId);
    beginnerObjectiveCountByPlayerId.delete(playerId);
    beginnerObjectiveActivePlayerIds.delete(playerId);
    nextTriggerTickByPlayer.delete(playerId);
    playerProgressionById.delete(playerId);
    anomalyEventActiveUntilTickByPlayerId.delete(playerId);
    anomalyEventNextAllowedTickByPlayerId.delete(playerId);
    anomalyCooldownClearObjectiveStartTickByPlayerId.delete(playerId);
    anomalyEventTunnelTriggeredPlayerIds.delete(playerId);
    anomalyEventTunnelSearchUntilTickByPlayerId.delete(playerId);
    anomalyEventTunnelCoordinateRequestedPlayerIds.delete(playerId);
    anomalyEventTunnelSeenChunkKeysByPlayerId.delete(playerId);
    anomalyEventTunnelNewlyLoadedChunkKeysByPlayerId.delete(playerId);
    anomalyEventTunnelChunkTrackingInitializedPlayerIds.delete(playerId);
    anomalyEventFakeJoinLeaveTriggeredPlayerIds.delete(playerId);
    playtestDevStatusTrackedPlayerIds.delete(playerId);
    system.run(() => clearSearchWheelEntitiesForPlayerId(playerId));
    searchSequenceRecentPlacedBlockTickByLocationKeyByPlayerId.delete(playerId);
    searchSequenceStartedTickByPlayerId.delete(playerId);
    searchSequenceWheelEntityIdByPlayerId.delete(playerId);
    searchSequenceWheelIsCrawlingByPlayerId.delete(playerId);
    searchSequenceNextAttackTickByPlayerId.delete(playerId);
    searchSequenceLastTeleportTickByPlayerId.delete(playerId);
};
