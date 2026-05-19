import type { Entity, Player, Vector3 } from "@minecraft/server";
import {
    SEARCH_SEQUENCE_WHEEL_NAME_TAG,
    SEARCH_SEQUENCE_WHEEL_TYPE_ID
} from "../../config/constants";
import { getSearchWheelOwnerTagForPlayerId } from "./getSearchwheelOwnerTagForPlayerId";

const SEARCH_WHEEL_SPAWN_FALLBACK_DISTANCE = 2;

const SEARCH_WHEEL_SPAWN_OFFSETS: readonly { x: number; z: number }[] = [
    { x: -6, z: 0 },
    { x: 6, z: 0 },
    { x: 0, z: -6 },
    { x: 0, z: 6 },
    { x: -4, z: -4 },
    { x: 4, z: 4 },
    { x: -4, z: 4 },
    { x: 4, z: -4 }
];

const isAirBlockType = (typeId: string): boolean => {
    return typeId === "minecraft:air";
};

const isUnsafeSupportBlockType = (typeId: string): boolean => {
    if (typeId === "minecraft:air") return true;
    if (typeId === "minecraft:water") return true;
    if (typeId === "minecraft:flowing_water") return true;
    if (typeId === "minecraft:lava") return true;
    if (typeId === "minecraft:flowing_lava") return true;

    return false;
};

const getSpawnLocationForPlayer = (player: Player): Vector3 => {
    const playerBlockX = Math.floor(player.location.x);
    const playerBlockY = Math.floor(player.location.y);
    const playerBlockZ = Math.floor(player.location.z);

    for (const offset of SEARCH_WHEEL_SPAWN_OFFSETS) {
        for (let yOffset = 2; yOffset >= -3; yOffset--) {
            const spawnX = playerBlockX + offset.x;
            const spawnY = playerBlockY + yOffset;
            const spawnZ = playerBlockZ + offset.z;

            const feetBlock = player.dimension.getBlock({ x: spawnX, y: spawnY, z: spawnZ });
            const headBlock = player.dimension.getBlock({ x: spawnX, y: spawnY + 1, z: spawnZ });
            const supportBlock = player.dimension.getBlock({ x: spawnX, y: spawnY - 1, z: spawnZ });
            if (!feetBlock || !headBlock || !supportBlock) continue;
            if (!isAirBlockType(feetBlock.typeId)) continue;
            if (!isAirBlockType(headBlock.typeId)) continue;
            if (isUnsafeSupportBlockType(supportBlock.typeId)) continue;

            return {
                x: spawnX + 0.5,
                y: spawnY,
                z: spawnZ + 0.5
            };
        }
    }

    const viewDirection = player.getViewDirection();
    const fallbackHorizontalLength = Math.sqrt(viewDirection.x * viewDirection.x + viewDirection.z * viewDirection.z);
    if (fallbackHorizontalLength <= 0) {
        return {
            x: player.location.x,
            y: player.location.y,
            z: player.location.z
        };
    }

    const normalizedX = viewDirection.x / fallbackHorizontalLength;
    const normalizedZ = viewDirection.z / fallbackHorizontalLength;

    return {
        x: player.location.x - normalizedX * SEARCH_WHEEL_SPAWN_FALLBACK_DISTANCE,
        y: player.location.y,
        z: player.location.z - normalizedZ * SEARCH_WHEEL_SPAWN_FALLBACK_DISTANCE
    };
};

export const spawnSearchWheelForPlayer = (player: Player): Entity | undefined => {
    if (!player.isValid) return undefined;

    const ownerTag = getSearchWheelOwnerTagForPlayerId(player.id);
    const spawnLocation = getSpawnLocationForPlayer(player);
    const wheel = player.dimension.spawnEntity(SEARCH_SEQUENCE_WHEEL_TYPE_ID, spawnLocation);
    if (!wheel?.isValid) return undefined;

    wheel.triggerEvent("twh:set_normal_stance");
    wheel.nameTag = SEARCH_SEQUENCE_WHEEL_NAME_TAG;
    wheel.addTag("the_wheel");
    wheel.addTag(ownerTag);

    return wheel;
};
