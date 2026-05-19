import type { Block, Player } from "@minecraft/server";
import {
    ANOMALY_EVENT_HILL_TUNNEL_ATTEMPTS,
    ANOMALY_EVENT_HILL_TUNNEL_MAX_DISTANCE_FROM_PLAYER,
    ANOMALY_EVENT_HILL_TUNNEL_LENGTH,
    ANOMALY_EVENT_HILL_TUNNEL_MAX_Y_OFFSET,
    ANOMALY_EVENT_HILL_TUNNEL_MIN_DISTANCE_FROM_PLAYER,
    ANOMALY_EVENT_HILL_TUNNEL_MIN_Y_OFFSET,
    ANOMALY_EVENT_HILL_TUNNEL_NATURAL_TYPE_IDS
} from "../config/constants";
import { formatTunnelAnomalyCoordinateMessage } from "../config/messages";
import { anomalyEventTunnelChunkTrackingInitializedPlayerIds } from "../state/anomalyEventTunnelChunkTrackingInitializedPlayerIds";
import { anomalyEventActiveUntilTickByPlayerId } from "../state/anomalyEventActiveUntilTickByPlayerId";
import { anomalyEventTunnelCoordinateRequestedPlayerIds } from "../state/anomalyEventTunnelCoordinateRequestedPlayerIds";
import { anomalyEventTunnelNewlyLoadedChunkKeysByPlayerId } from "../state/anomalyEventTunnelNewlyLoadedChunkKeysByPlayerId";
import { anomalyEventTunnelSeenChunkKeysByPlayerId } from "../state/anomalyEventTunnelSeenChunkKeysByPlayerId";
import { anomalyEventTunnelTriggeredPlayerIds } from "../state/anomalyEventTunnelTriggeredPlayerIds";
import { randomInt } from "../utils/randomInt";

const ANOMALY_EVENT_HILL_TUNNEL_NATURAL_TYPE_IDS_SET = new Set<string>(ANOMALY_EVENT_HILL_TUNNEL_NATURAL_TYPE_IDS);
const CHUNK_SIZE = 16;

const isAirBlock = (block: Block | undefined): boolean => {
    if (!block) return false;
    return block.typeId === "minecraft:air";
};

const isNaturalTunnelCarveBlock = (block: Block | undefined): boolean => {
    if (!block) return false;
    if (block.typeId === "minecraft:air") return false;

    return ANOMALY_EVENT_HILL_TUNNEL_NATURAL_TYPE_IDS_SET.has(block.typeId);
};

const toChunkCoordinate = (coordinate: number): number => {
    return Math.floor(coordinate / CHUNK_SIZE);
};

const toChunkKey = (chunkX: number, chunkZ: number): string => {
    return `${chunkX},${chunkZ}`;
};

const toChunkCoordinates = (chunkKey: string): { chunkX: number; chunkZ: number } | undefined => {
    const [chunkXRaw, chunkZRaw] = chunkKey.split(",");
    const chunkX = Number(chunkXRaw);
    const chunkZ = Number(chunkZRaw);
    if (!Number.isFinite(chunkX) || !Number.isFinite(chunkZ)) return undefined;

    return { chunkX, chunkZ };
};

const getOrCreateSeenChunkKeysForPlayer = (playerId: string): Set<string> => {
    const existing = anomalyEventTunnelSeenChunkKeysByPlayerId.get(playerId);
    if (existing) return existing;

    const created = new Set<string>();
    anomalyEventTunnelSeenChunkKeysByPlayerId.set(playerId, created);
    return created;
};

const getOrCreateNewlyLoadedChunkKeysForPlayer = (playerId: string): Set<string> => {
    const existing = anomalyEventTunnelNewlyLoadedChunkKeysByPlayerId.get(playerId);
    if (existing) return existing;

    const created = new Set<string>();
    anomalyEventTunnelNewlyLoadedChunkKeysByPlayerId.set(playerId, created);
    return created;
};

const updateNewlyLoadedChunkKeysForPlayer = (player: Player): void => {
    const playerId = player.id;
    const seenChunkKeys = getOrCreateSeenChunkKeysForPlayer(playerId);
    const newlyLoadedChunkKeys = getOrCreateNewlyLoadedChunkKeysForPlayer(playerId);

    const playerChunkX = toChunkCoordinate(player.location.x);
    const playerChunkZ = toChunkCoordinate(player.location.z);
    const chunkRadius = Math.ceil(ANOMALY_EVENT_HILL_TUNNEL_MAX_DISTANCE_FROM_PLAYER / CHUNK_SIZE) + 1;
    const hasInitializedTracking = anomalyEventTunnelChunkTrackingInitializedPlayerIds.has(playerId);

    const probeY = Math.floor(player.location.y);

    for (let chunkX = playerChunkX - chunkRadius; chunkX <= playerChunkX + chunkRadius; chunkX++) {
        for (let chunkZ = playerChunkZ - chunkRadius; chunkZ <= playerChunkZ + chunkRadius; chunkZ++) {
            const chunkCenterX = chunkX * CHUNK_SIZE + Math.floor(CHUNK_SIZE / 2);
            const chunkCenterZ = chunkZ * CHUNK_SIZE + Math.floor(CHUNK_SIZE / 2);
            const probeBlock = player.dimension.getBlock({
                x: chunkCenterX,
                y: probeY,
                z: chunkCenterZ
            });
            if (!probeBlock) continue;

            const chunkKey = toChunkKey(chunkX, chunkZ);
            if (seenChunkKeys.has(chunkKey)) continue;

            seenChunkKeys.add(chunkKey);
            if (hasInitializedTracking) {
                newlyLoadedChunkKeys.add(chunkKey);
            }
        }
    }

    anomalyEventTunnelChunkTrackingInitializedPlayerIds.add(playerId);
};

const getCandidateNewlyLoadedChunkKeysForPlayer = (player: Player): string[] => {
    const newlyLoadedChunkKeys = anomalyEventTunnelNewlyLoadedChunkKeysByPlayerId.get(player.id);
    if (!newlyLoadedChunkKeys || newlyLoadedChunkKeys.size === 0) return [];

    const minDistanceSquared = ANOMALY_EVENT_HILL_TUNNEL_MIN_DISTANCE_FROM_PLAYER * ANOMALY_EVENT_HILL_TUNNEL_MIN_DISTANCE_FROM_PLAYER;
    const maxDistanceSquared = ANOMALY_EVENT_HILL_TUNNEL_MAX_DISTANCE_FROM_PLAYER * ANOMALY_EVENT_HILL_TUNNEL_MAX_DISTANCE_FROM_PLAYER;
    const candidateKeys: string[] = [];

    for (const chunkKey of newlyLoadedChunkKeys) {
        const chunkCoordinates = toChunkCoordinates(chunkKey);
        if (!chunkCoordinates) continue;

        const centerX = chunkCoordinates.chunkX * CHUNK_SIZE + Math.floor(CHUNK_SIZE / 2);
        const centerZ = chunkCoordinates.chunkZ * CHUNK_SIZE + Math.floor(CHUNK_SIZE / 2);

        const deltaX = centerX - player.location.x;
        const deltaZ = centerZ - player.location.z;
        const distanceSquared = deltaX * deltaX + deltaZ * deltaZ;
        if (distanceSquared < minDistanceSquared) continue;
        if (distanceSquared > maxDistanceSquared) continue;

        candidateKeys.push(chunkKey);
    }

    return candidateKeys;
};

const clearTunnelChunkTrackingForPlayer = (playerId: string): void => {
    anomalyEventTunnelSeenChunkKeysByPlayerId.delete(playerId);
    anomalyEventTunnelNewlyLoadedChunkKeysByPlayerId.delete(playerId);
    anomalyEventTunnelChunkTrackingInitializedPlayerIds.delete(playerId);
};

const canCarveAt = (
    player: Player,
    x: number,
    y: number,
    z: number,
    directionX: number,
    directionZ: number,
    rightX: number,
    rightZ: number
): boolean => {
    for (let width = 0; width < 2; width++) {
        for (let height = 0; height < 2; height++) {
            const entranceBlock = player.dimension.getBlock({
                x: x + rightX * width,
                y: y + height,
                z: z + rightZ * width
            });
            if (!isAirBlock(entranceBlock)) return false;

            for (let depth = 1; depth <= ANOMALY_EVENT_HILL_TUNNEL_LENGTH; depth++) {
                const innerBlock = player.dimension.getBlock({
                    x: x + directionX * depth + rightX * width,
                    y: y + height,
                    z: z + directionZ * depth + rightZ * width
                });
                if (!isNaturalTunnelCarveBlock(innerBlock)) return false;
            }
        }
    }

    return true;
};

const carveAt = (
    player: Player,
    x: number,
    y: number,
    z: number,
    directionX: number,
    directionZ: number,
    rightX: number,
    rightZ: number
): void => {
    for (let depth = 1; depth <= ANOMALY_EVENT_HILL_TUNNEL_LENGTH; depth++) {
        for (let width = 0; width < 2; width++) {
            for (let height = 0; height < 2; height++) {
                const targetBlock = player.dimension.getBlock({
                    x: x + directionX * depth + rightX * width,
                    y: y + height,
                    z: z + directionZ * depth + rightZ * width
                });
                if (!targetBlock) continue;
                targetBlock.setType("minecraft:air");
            }
        }
    }
};

export const tryTriggerHillTunnelAnomalyForPlayer = (player: Player): boolean => {
    if (!player.isValid) return false;
    if (anomalyEventTunnelTriggeredPlayerIds.has(player.id)) return false;

    updateNewlyLoadedChunkKeysForPlayer(player);

    const baseX = Math.floor(player.location.x);
    const baseY = Math.floor(player.location.y);
    const baseZ = Math.floor(player.location.z);

    const newlyLoadedChunkKeys = anomalyEventTunnelNewlyLoadedChunkKeysByPlayerId.get(player.id);
    if (!newlyLoadedChunkKeys) return false;

    const candidateChunkKeys = getCandidateNewlyLoadedChunkKeysForPlayer(player);
    if (candidateChunkKeys.length === 0) return false;

    const startChunkIndex = randomInt(0, candidateChunkKeys.length - 1);
    for (let chunkOffset = 0; chunkOffset < candidateChunkKeys.length; chunkOffset++) {
        const chunkIndex = (startChunkIndex + chunkOffset) % candidateChunkKeys.length;
        const chunkKey = candidateChunkKeys[chunkIndex];
        const chunkCoordinates = toChunkCoordinates(chunkKey);
        if (!chunkCoordinates) continue;

        const chunkMinX = chunkCoordinates.chunkX * CHUNK_SIZE;
        const chunkMaxX = chunkMinX + CHUNK_SIZE - 1;
        const chunkMinZ = chunkCoordinates.chunkZ * CHUNK_SIZE;
        const chunkMaxZ = chunkMinZ + CHUNK_SIZE - 1;

        for (let attempt = 0; attempt < ANOMALY_EVENT_HILL_TUNNEL_ATTEMPTS; attempt++) {
            const angle = Math.random() * Math.PI * 2;

            const directionX = Math.round(Math.cos(angle));
            const directionZ = Math.round(Math.sin(angle));
            if (directionX === 0 && directionZ === 0) continue;

            const rightX = -directionZ;
            const rightZ = directionX;

            const x = randomInt(chunkMinX, chunkMaxX);
            const z = randomInt(chunkMinZ, chunkMaxZ);

            for (let yOffset = ANOMALY_EVENT_HILL_TUNNEL_MAX_Y_OFFSET; yOffset >= ANOMALY_EVENT_HILL_TUNNEL_MIN_Y_OFFSET; yOffset--) {
                const y = baseY + yOffset;
                if (!canCarveAt(player, x, y, z, directionX, directionZ, rightX, rightZ)) continue;

                carveAt(player, x, y, z, directionX, directionZ, rightX, rightZ);
                anomalyEventTunnelTriggeredPlayerIds.add(player.id);
                anomalyEventActiveUntilTickByPlayerId.delete(player.id);
                clearTunnelChunkTrackingForPlayer(player.id);
                if (anomalyEventTunnelCoordinateRequestedPlayerIds.has(player.id)) {
                    player.sendMessage(formatTunnelAnomalyCoordinateMessage(x, y, z));
                    anomalyEventTunnelCoordinateRequestedPlayerIds.delete(player.id);
                }
                return true;
            }
        }

        newlyLoadedChunkKeys.delete(chunkKey);
    }

    return false;
};
