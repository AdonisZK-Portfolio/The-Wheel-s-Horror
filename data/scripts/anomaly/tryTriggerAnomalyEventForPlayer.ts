import { system, type Player } from "@minecraft/server";
import {
    ANOMALY_EVENT_ACTIVE_SECONDS,
    ANOMALY_EVENT_COOLDOWN_CLEAR_REMAINING_OBJECTIVE_SECONDS,
    ANOMALY_EVENT_COOLDOWN_SECONDS,
    ANOMALY_EVENT_SMALL_COOLDOWN_SECONDS,
    TICKS_PER_SECOND
} from "../config/constants";
import { MESSAGE_WHEEL_ANOMALY_TUNNEL_SEARCH_TIMEOUT_SELF } from "../config/messages";
import { getAnomalyTriggerChanceForPlayer } from "./getAnomalyTriggerChanceForPlayer";
import { activeObjectives } from "../state/activeObjectives";
import { anomalyCooldownClearObjectiveStartTickByPlayerId } from "../state/anomalyCooldownClearObjectiveStartTickByPlayerId";
import { anomalyEventActiveUntilTickByPlayerId } from "../state/anomalyEventActiveUntilTickByPlayerId";
import { anomalyEventNextAllowedTickByPlayerId } from "../state/anomalyEventNextAllowedTickByPlayerId";
import { anomalyEventTunnelCoordinateRequestedPlayerIds } from "../state/anomalyEventTunnelCoordinateRequestedPlayerIds";
import { anomalyEventTunnelSearchUntilTickByPlayerId } from "../state/anomalyEventTunnelSearchUntilTickByPlayerId";
import { anomalyEventTunnelTriggeredPlayerIds } from "../state/anomalyEventTunnelTriggeredPlayerIds";
import { randomInt } from "../utils/randomInt";
import { tryTriggerDoorMemoryGlitchForPlayer } from "./tryTriggerDoorMemoryGlitchForPlayer";
import { tryTriggerFakeJoinLeaveEchoForPlayer } from "./tryTriggerFakeJoinLeaveEchoForPlayer";
import { tryTriggerFootstepIllusionForPlayer } from "./tryTriggerFootstepIllusionForPlayer";
import { tryTriggerHillTunnelAnomalyForPlayer } from "./tryTriggerHillTunnelAnomalyForPlayer";
import { tryTriggerTorchRemovalForPlayer } from "./tryTriggerTorchRemovalForPlayer";
import { triggerAnomalyTreeMutationForPlayer } from "./triggerAnomalyTreeMutationForPlayer";

export const tryTriggerAnomalyEventForPlayer = (player: Player): void => {
    if (!player.isValid) return;

    const currentTick = system.currentTick;

    const activeUntilTick = anomalyEventActiveUntilTickByPlayerId.get(player.id) ?? 0;
    if (currentTick < activeUntilTick) {
        triggerAnomalyTreeMutationForPlayer(player);
        return;
    }

    const tunnelSearchUntilTick = anomalyEventTunnelSearchUntilTickByPlayerId.get(player.id);
    if (tunnelSearchUntilTick !== undefined) {
        if (currentTick >= tunnelSearchUntilTick) {
            anomalyEventTunnelSearchUntilTickByPlayerId.delete(player.id);

            if (anomalyEventTunnelCoordinateRequestedPlayerIds.has(player.id)) {
                player.sendMessage(MESSAGE_WHEEL_ANOMALY_TUNNEL_SEARCH_TIMEOUT_SELF);
            }

            anomalyEventTunnelCoordinateRequestedPlayerIds.delete(player.id);
        } else {
            if (tryTriggerHillTunnelAnomalyForPlayer(player)) {
                setSharedAnomalyCooldownForPlayer(player.id, currentTick, ANOMALY_EVENT_COOLDOWN_SECONDS);
                anomalyEventTunnelSearchUntilTickByPlayerId.delete(player.id);
            }

            return;
        }
    }

    maybeClearSharedCooldownAtFinalObjectiveWindow(player.id, currentTick);

    const nextAllowedTick = anomalyEventNextAllowedTickByPlayerId.get(player.id) ?? 0;
    if (currentTick < nextAllowedTick) return;

    const triggerChancePerSecond = getAnomalyTriggerChanceForPlayer(player.id, currentTick);
    if (Math.random() > triggerChancePerSecond) return;

    tryTriggerRandomAnomalyForPlayer(player, currentTick);
};

const maybeClearSharedCooldownAtFinalObjectiveWindow = (playerId: string, currentTick: number): void => {
    const activeObjective = activeObjectives.get(playerId);
    if (!activeObjective) {
        anomalyCooldownClearObjectiveStartTickByPlayerId.delete(playerId);
        return;
    }

    const finalWindowStartTick = activeObjective.deadlineTick
        - ANOMALY_EVENT_COOLDOWN_CLEAR_REMAINING_OBJECTIVE_SECONDS * TICKS_PER_SECOND;
    if (currentTick < finalWindowStartTick) return;

    const clearedObjectiveStartedTick = anomalyCooldownClearObjectiveStartTickByPlayerId.get(playerId);
    if (clearedObjectiveStartedTick === activeObjective.startedTick) return;

    const nextAllowedTick = anomalyEventNextAllowedTickByPlayerId.get(playerId);
    if (nextAllowedTick !== undefined && nextAllowedTick > currentTick) {
        anomalyEventNextAllowedTickByPlayerId.set(playerId, currentTick);
    }

    anomalyCooldownClearObjectiveStartTickByPlayerId.set(playerId, activeObjective.startedTick);
};

const setSharedAnomalyCooldownForPlayer = (playerId: string, currentTick: number, cooldownSeconds: number): void => {
    anomalyEventNextAllowedTickByPlayerId.set(
        playerId,
        currentTick + cooldownSeconds * TICKS_PER_SECOND
    );
};

const tryTriggerTreeMutationAnomalyForPlayer = (player: Player, currentTick: number): boolean => {
    if (!triggerAnomalyTreeMutationForPlayer(player)) return false;

    anomalyEventActiveUntilTickByPlayerId.set(
        player.id,
        currentTick + ANOMALY_EVENT_ACTIVE_SECONDS * TICKS_PER_SECOND
    );
    setSharedAnomalyCooldownForPlayer(player.id, currentTick, ANOMALY_EVENT_COOLDOWN_SECONDS);
    return true;
};

const tryTriggerHillTunnelAnomalyWithCooldownForPlayer = (player: Player, currentTick: number): boolean => {
    if (anomalyEventTunnelTriggeredPlayerIds.has(player.id)) return false;

    if (tryTriggerHillTunnelAnomalyForPlayer(player)) {
        setSharedAnomalyCooldownForPlayer(player.id, currentTick, ANOMALY_EVENT_COOLDOWN_SECONDS);
        anomalyEventTunnelSearchUntilTickByPlayerId.delete(player.id);
        return true;
    }

    anomalyEventTunnelSearchUntilTickByPlayerId.set(
        player.id,
        currentTick + ANOMALY_EVENT_ACTIVE_SECONDS * TICKS_PER_SECOND
    );
    return true;
};

const tryTriggerFootstepIllusionAnomalyWithCooldownForPlayer = (player: Player, currentTick: number): boolean => {
    if (!tryTriggerFootstepIllusionForPlayer(player)) return false;
    setSharedAnomalyCooldownForPlayer(player.id, currentTick, ANOMALY_EVENT_COOLDOWN_SECONDS);
    return true;
};

const tryTriggerDoorMemoryGlitchAnomalyWithCooldownForPlayer = (player: Player, currentTick: number): boolean => {
    if (!tryTriggerDoorMemoryGlitchForPlayer(player)) return false;
    setSharedAnomalyCooldownForPlayer(player.id, currentTick, ANOMALY_EVENT_SMALL_COOLDOWN_SECONDS);
    return true;
};

const tryTriggerTorchRemovalAnomalyWithCooldownForPlayer = (player: Player, currentTick: number): boolean => {
    if (!tryTriggerTorchRemovalForPlayer(player)) return false;
    setSharedAnomalyCooldownForPlayer(player.id, currentTick, ANOMALY_EVENT_SMALL_COOLDOWN_SECONDS);
    return true;
};

const tryTriggerFakeJoinLeaveEchoAnomalyWithCooldownForPlayer = (player: Player, currentTick: number): boolean => {
    if (!tryTriggerFakeJoinLeaveEchoForPlayer(player)) return false;
    setSharedAnomalyCooldownForPlayer(player.id, currentTick, ANOMALY_EVENT_SMALL_COOLDOWN_SECONDS);
    return true;
};

const tryTriggerRandomAnomalyForPlayer = (player: Player, currentTick: number): boolean => {
    const triggerPipeline = [
        tryTriggerTreeMutationAnomalyForPlayer,
        tryTriggerHillTunnelAnomalyWithCooldownForPlayer,
        tryTriggerFootstepIllusionAnomalyWithCooldownForPlayer,
        tryTriggerDoorMemoryGlitchAnomalyWithCooldownForPlayer,
        tryTriggerTorchRemovalAnomalyWithCooldownForPlayer,
        tryTriggerFakeJoinLeaveEchoAnomalyWithCooldownForPlayer
    ];

    const startIndex = randomInt(0, triggerPipeline.length - 1);
    for (let offset = 0; offset < triggerPipeline.length; offset++) {
        const pipelineIndex = (startIndex + offset) % triggerPipeline.length;
        const triggerAnomaly = triggerPipeline[pipelineIndex];
        if (!triggerAnomaly(player, currentTick)) continue;
        return true;
    }

    return false;
};

export const forceTriggerAnomalyEventForPlayer = (player: Player): boolean => {
    if (!player.isValid) return false;

    const currentTick = system.currentTick;
    return tryTriggerTreeMutationAnomalyForPlayer(player, currentTick);
};

export const forceStartTunnelAnomalyForPlayer = (player: Player): boolean => {
    if (!player.isValid) return false;
    if (anomalyEventTunnelTriggeredPlayerIds.has(player.id)) return false;

    const currentTick = system.currentTick;

    if (tryTriggerHillTunnelAnomalyForPlayer(player)) {
        setSharedAnomalyCooldownForPlayer(player.id, currentTick, ANOMALY_EVENT_COOLDOWN_SECONDS);
        anomalyEventTunnelSearchUntilTickByPlayerId.delete(player.id);
        return true;
    }

    anomalyEventTunnelSearchUntilTickByPlayerId.set(
        player.id,
        currentTick + ANOMALY_EVENT_ACTIVE_SECONDS * TICKS_PER_SECOND
    );
    return true;
};
