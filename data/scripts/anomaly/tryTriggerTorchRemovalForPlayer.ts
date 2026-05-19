import { BlockVolume, type Player, type Vector3 } from "@minecraft/server";
import {
    ANOMALY_EVENT_MAX_DISTANCE_FROM_PLAYER,
    ANOMALY_EVENT_MIN_DISTANCE_FROM_PLAYER,
    ANOMALY_EVENT_TORCH_TYPE_IDS
} from "../config/constants";
import { randomInt } from "../utils/randomInt";

const ANOMALY_EVENT_TORCH_TYPE_IDS_SET = new Set<string>(ANOMALY_EVENT_TORCH_TYPE_IDS);

const getHorizontalDistanceSquared = (left: Vector3, right: Vector3): number => {
    const deltaX = left.x - right.x;
    const deltaZ = left.z - right.z;
    return deltaX * deltaX + deltaZ * deltaZ;
};

export const tryTriggerTorchRemovalForPlayer = (player: Player): boolean => {
    if (!player.isValid) return false;

    const min = {
        x: Math.floor(player.location.x) - ANOMALY_EVENT_MAX_DISTANCE_FROM_PLAYER,
        y: -64,
        z: Math.floor(player.location.z) - ANOMALY_EVENT_MAX_DISTANCE_FROM_PLAYER
    };
    const max = {
        x: Math.floor(player.location.x) + ANOMALY_EVENT_MAX_DISTANCE_FROM_PLAYER,
        y: 320,
        z: Math.floor(player.location.z) + ANOMALY_EVENT_MAX_DISTANCE_FROM_PLAYER
    };

    const matchingTorches = player.dimension.getBlocks(
        new BlockVolume(min, max),
        { includeTags: ["torch"] },
        true
    );

    const minDistanceSquared = ANOMALY_EVENT_MIN_DISTANCE_FROM_PLAYER * ANOMALY_EVENT_MIN_DISTANCE_FROM_PLAYER;
    const maxDistanceSquared = ANOMALY_EVENT_MAX_DISTANCE_FROM_PLAYER * ANOMALY_EVENT_MAX_DISTANCE_FROM_PLAYER;

    const candidateLocations: Vector3[] = [];
    for (const location of matchingTorches.getBlockLocationIterator()) {
        const distanceSquared = getHorizontalDistanceSquared(location, player.location);
        if (distanceSquared < minDistanceSquared) continue;
        if (distanceSquared > maxDistanceSquared) continue;

        const block = player.dimension.getBlock(location);
        if (!block) continue;
        if (!ANOMALY_EVENT_TORCH_TYPE_IDS_SET.has(block.typeId)) continue;

        candidateLocations.push(location);
    }

    if (candidateLocations.length === 0) return false;

    const selectedIndex = randomInt(0, candidateLocations.length - 1);
    const selectedTorch = player.dimension.getBlock(candidateLocations[selectedIndex]);
    if (!selectedTorch) return false;
    if (!ANOMALY_EVENT_TORCH_TYPE_IDS_SET.has(selectedTorch.typeId)) return false;

    selectedTorch.setType("minecraft:air");
    return true;
};
