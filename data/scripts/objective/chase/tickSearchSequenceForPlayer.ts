import { system, type Entity, type EntityHealthComponent, type Player } from "@minecraft/server";
import {
    SEARCH_SEQUENCE_WHEEL_ATTACK_DAMAGE,
    SEARCH_SEQUENCE_WHEEL_ATTACK_COOLDOWN_TICKS,
    SEARCH_SEQUENCE_WHEEL_ATTACK_RANGE,
    SEARCH_SEQUENCE_WHEEL_BREAK_BLOCKS_PER_TICK,
    SEARCH_SEQUENCE_WHEEL_TELEPORT_INTERVAL_TICKS
} from "../../config/constants";
import { getBlockLocationKey } from "../../anomaly/getBlockLocationKey";
import { searchSequenceWheelIsCrawlingByPlayerId } from "../../state/searchSequencewheelIsCrawlingByPlayerId";
import { searchSequenceNextAttackTickByPlayerId } from "../../state/searchSequenceNextAttackTickByPlayerId";
import { searchSequenceStartedTickByPlayerId } from "../../state/searchSequenceStartedTickByPlayerId";
import { searchSequenceLastTeleportTickByPlayerId } from "../../state/searchSequenceLastTeleportTickByPlayerId";
import { cleanupExpiredSearchSequenceRecentPlacedBlocksForPlayer } from "./cleanupExpiredSearchSequenceRecentPlacedBlocksForPlayer";
import { destroyNearbyVehicles } from "./destroyNearbyVehicles";
import { getOrSpawnSearchWheelForPlayer } from "./getOrSpawnSearchwheelForPlayer";
import { hasSearchSequenceRecentPlacedBlockForPlayer } from "./hasSearchSequenceRecentPlacedBlockForPlayer";
const SEARCH_SEQUENCE_WHEEL_SET_NORMAL_STANCE_EVENT = "twh:set_normal_stance";
const SEARCH_SEQUENCE_WHEEL_SET_CRAWLING_STANCE_EVENT = "twh:set_crawling_stance";

const SEARCH_SEQUENCE_UNBREAKABLE_BLOCK_TYPE_IDS = new Set<string>([
    "minecraft:air",
    "minecraft:water",
    "minecraft:flowing_water",
    "minecraft:lava",
    "minecraft:flowing_lava",
    "minecraft:bedrock",
    "minecraft:barrier",
    "minecraft:end_portal",
    "minecraft:end_portal_frame",
    "minecraft:command_block",
    "minecraft:repeating_command_block",
    "minecraft:chain_command_block",
    "minecraft:structure_block",
    "minecraft:allow",
    "minecraft:deny"
]);

const CHEESE_BREAK_OFFSETS: readonly { x: number; y: number; z: number }[] = [
    { x: 0, y: -2, z: 0 },
    { x: 0, y: -1, z: 0 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: 2, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: -1, y: 0, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: 0, y: 0, z: -1 },
    { x: 1, y: 1, z: 0 },
    { x: -1, y: 1, z: 0 },
    { x: 0, y: 1, z: 1 },
    { x: 0, y: 1, z: -1 },
    { x: 1, y: 2, z: 0 },
    { x: -1, y: 2, z: 0 },
    { x: 0, y: 2, z: 1 },
    { x: 0, y: 2, z: -1 }
];

const getHorizontalDistance = (from: { x: number; z: number }, to: { x: number; z: number }): number => {
    const deltaX = to.x - from.x;
    const deltaZ = to.z - from.z;

    return Math.sqrt(deltaX * deltaX + deltaZ * deltaZ);
};

const getDistance = (from: { x: number; y: number; z: number }, to: { x: number; y: number; z: number }): number => {
    const deltaX = to.x - from.x;
    const deltaY = to.y - from.y;
    const deltaZ = to.z - from.z;

    return Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
};

const isAirType = (typeId: string): boolean => {
    if (typeId === "minecraft:air") return true;
    if (typeId === "minecraft:cave_air") return true;
    if (typeId === "minecraft:void_air") return true;

    return false;
};

const isPlayerUsingCrawlEscapeSpace = (player: Player): boolean => {
    if (player.isSwimming) return true;

    const baseX = Math.floor(player.location.x);
    const baseY = Math.floor(player.location.y);
    const baseZ = Math.floor(player.location.z);

    const headBlock = player.dimension.getBlock({ x: baseX, y: baseY + 1, z: baseZ });
    if (!headBlock) return false;

    return !isAirType(headBlock.typeId);
};

const syncWheelStanceWithPlayer = (wheel: Entity, player: Player): void => {
    const shouldUseCrawlingStance = isPlayerUsingCrawlEscapeSpace(player);
    const wasUsingCrawlingStance = searchSequenceWheelIsCrawlingByPlayerId.get(player.id) ?? false;
    if (shouldUseCrawlingStance === wasUsingCrawlingStance) return;

    wheel.triggerEvent(shouldUseCrawlingStance
        ? SEARCH_SEQUENCE_WHEEL_SET_CRAWLING_STANCE_EVENT
        : SEARCH_SEQUENCE_WHEEL_SET_NORMAL_STANCE_EVENT);

    searchSequenceWheelIsCrawlingByPlayerId.set(player.id, shouldUseCrawlingStance);
};

const shouldBreakBlockType = (typeId: string): boolean => {
    if (SEARCH_SEQUENCE_UNBREAKABLE_BLOCK_TYPE_IDS.has(typeId)) return false;
    if (typeId.includes("bedrock")) return false;
    if (typeId.includes("portal")) return false;
    if (typeId.includes("command_block")) return false;

    return true;
};

const breakCheeseBlocksNearPlayer = (player: Player, chaseStartTick: number): void => {
    const baseX = Math.floor(player.location.x);
    const baseY = Math.floor(player.location.y);
    const baseZ = Math.floor(player.location.z);
    const dimensionId = player.dimension.id;

    let brokenBlocks = 0;

    for (const offset of CHEESE_BREAK_OFFSETS) {
        if (brokenBlocks >= SEARCH_SEQUENCE_WHEEL_BREAK_BLOCKS_PER_TICK) return;

        const targetLocation = {
            x: baseX + offset.x,
            y: baseY + offset.y,
            z: baseZ + offset.z
        };

        const locationKey = getBlockLocationKey(dimensionId, targetLocation);
        if (!hasSearchSequenceRecentPlacedBlockForPlayer(player.id, locationKey, chaseStartTick)) continue;

        const block = player.dimension.getBlock({
            x: targetLocation.x,
            y: targetLocation.y,
            z: targetLocation.z
        });
        if (!block) continue;
        if (!shouldBreakBlockType(block.typeId)) continue;

        block.setType("minecraft:air");
        brokenBlocks++;
    }
};

const keepWheelAlive = (wheel: Entity): void => {
    if (!wheel.isValid) return;

    const healthComponent = wheel.getComponent("health") as EntityHealthComponent | undefined;
    if (!healthComponent) return;
    if (healthComponent.currentValue <= 0) return;

    healthComponent.resetToMaxValue();
};

const tickScheduledTeleport = (wheel: Entity, player: Player, nowTick: number): void => {
    const lastTeleportTick = searchSequenceLastTeleportTickByPlayerId.get(player.id);
    if (lastTeleportTick === undefined) {
        searchSequenceLastTeleportTickByPlayerId.set(player.id, nowTick);
        return;
    }

    if (nowTick - lastTeleportTick < SEARCH_SEQUENCE_WHEEL_TELEPORT_INTERVAL_TICKS) return;

    searchSequenceLastTeleportTickByPlayerId.set(player.id, nowTick);
    wheel.teleport(player.location);
};

export const tickSearchSequenceForPlayer = (player: Player): void => {
    if (!player.isValid) return;
    if (!searchSequenceStartedTickByPlayerId.has(player.id)) return;

    const nowTick = system.currentTick;
    const chaseStartTick = searchSequenceStartedTickByPlayerId.get(player.id)!;
    cleanupExpiredSearchSequenceRecentPlacedBlocksForPlayer(player.id, nowTick);

    const wheel = getOrSpawnSearchWheelForPlayer(player);
    if (!wheel?.isValid) return;

    keepWheelAlive(wheel);
    syncWheelStanceWithPlayer(wheel, player);

    destroyNearbyVehicles(wheel);

    const horizontalDistance = getHorizontalDistance(wheel.location, player.location);
    const verticalDistance = player.location.y - wheel.location.y;
    const fullDistance = getDistance(wheel.location, player.location);

    tickScheduledTeleport(wheel, player, nowTick);

    const shouldBreakProtectionBlocks = horizontalDistance <= 6
        || verticalDistance >= 2
        || player.isInWater
        || player.isSwimming;

    if (shouldBreakProtectionBlocks) {
        breakCheeseBlocksNearPlayer(player, chaseStartTick);
    }

    const nextAttackTick = searchSequenceNextAttackTickByPlayerId.get(player.id) ?? 0;
    if (fullDistance <= SEARCH_SEQUENCE_WHEEL_ATTACK_RANGE && nowTick >= nextAttackTick) {
        player.applyDamage(SEARCH_SEQUENCE_WHEEL_ATTACK_DAMAGE);
        searchSequenceNextAttackTickByPlayerId.set(player.id, nowTick + SEARCH_SEQUENCE_WHEEL_ATTACK_COOLDOWN_TICKS);
    }
    wheel.lookAt(player.location);
};
