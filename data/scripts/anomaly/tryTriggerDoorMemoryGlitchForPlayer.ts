import { BlockVolume, type Player, type Vector3 } from "@minecraft/server";
import {
    ANOMALY_EVENT_DOOR_MAX_DISTANCE_FROM_PLAYER,
    ANOMALY_EVENT_MIN_DISTANCE_FROM_PLAYER,
    ANOMALY_EVENT_WOODEN_DOOR_TYPE_IDS
} from "../config/constants";
import { randomInt } from "../utils/randomInt";

const ANOMALY_EVENT_WOODEN_DOOR_TYPE_IDS_SET = new Set<string>(ANOMALY_EVENT_WOODEN_DOOR_TYPE_IDS);

const getHorizontalDistanceSquared = (left: Vector3, right: Vector3): number => {
    const deltaX = left.x - right.x;
    const deltaZ = left.z - right.z;
    return deltaX * deltaX + deltaZ * deltaZ;
};

const getBooleanStateValue = (stateValue: boolean | number | string | undefined): boolean | undefined => {
    if (stateValue === true || stateValue === 1 || stateValue === "true") return true;
    if (stateValue === false || stateValue === 0 || stateValue === "false") return false;
    return undefined;
};

export const triggerDoorMemoryGlitchForPlayer = (player: Player): Vector3 | undefined => {
    if (!player.isValid) return undefined;

    const min = {
        x: Math.floor(player.location.x) - ANOMALY_EVENT_DOOR_MAX_DISTANCE_FROM_PLAYER,
        y: -64,
        z: Math.floor(player.location.z) - ANOMALY_EVENT_DOOR_MAX_DISTANCE_FROM_PLAYER
    };
    const max = {
        x: Math.floor(player.location.x) + ANOMALY_EVENT_DOOR_MAX_DISTANCE_FROM_PLAYER,
        y: 320,
        z: Math.floor(player.location.z) + ANOMALY_EVENT_DOOR_MAX_DISTANCE_FROM_PLAYER
    };

    const matchingDoors = player.dimension.getBlocks(
        new BlockVolume(min, max),
        { includeTypes: ANOMALY_EVENT_WOODEN_DOOR_TYPE_IDS },
        true
    );

    const minDistanceSquared = ANOMALY_EVENT_MIN_DISTANCE_FROM_PLAYER * ANOMALY_EVENT_MIN_DISTANCE_FROM_PLAYER;
    const maxDistanceSquared = ANOMALY_EVENT_DOOR_MAX_DISTANCE_FROM_PLAYER * ANOMALY_EVENT_DOOR_MAX_DISTANCE_FROM_PLAYER;

    const candidateLocations: Vector3[] = [];
    for (const location of matchingDoors.getBlockLocationIterator()) {
        const distanceSquared = getHorizontalDistanceSquared(location, player.location);
        if (distanceSquared < minDistanceSquared) continue;
        if (distanceSquared > maxDistanceSquared) continue;

        const block = player.dimension.getBlock(location);
        if (!block) continue;
        if (!ANOMALY_EVENT_WOODEN_DOOR_TYPE_IDS_SET.has(block.typeId)) continue;

        const upperBlockBit = getBooleanStateValue(block.permutation.getState("upper_block_bit"));
        if (upperBlockBit === true) continue;

        const openBit = getBooleanStateValue(block.permutation.getState("open_bit"));
        if (openBit === undefined) continue;

        candidateLocations.push(location);
    }

    if (candidateLocations.length === 0) return undefined;

    const selectedIndex = randomInt(0, candidateLocations.length - 1);
    const selectedLocation = candidateLocations[selectedIndex];
    const selectedDoor = player.dimension.getBlock(selectedLocation);
    if (!selectedDoor) return undefined;

    const openBit = getBooleanStateValue(selectedDoor.permutation.getState("open_bit"));
    if (openBit === undefined) return undefined;

    selectedDoor.setPermutation(selectedDoor.permutation.withState("open_bit", !openBit));
    return selectedLocation;
};

export const tryTriggerDoorMemoryGlitchForPlayer = (player: Player): boolean => {
    return triggerDoorMemoryGlitchForPlayer(player) !== undefined;
};
