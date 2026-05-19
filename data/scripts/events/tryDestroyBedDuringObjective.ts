import {
    system,
    type Dimension,
    type PlayerInteractWithBlockBeforeEvent,
    type Vector3
} from "@minecraft/server";
import { MESSAGE_BED_DESTROYED_DURING_OBJECTIVE } from "../config/messages";

const BED_DESTROY_DELAY_TICKS = 40;
const pendingBedDestroyLocationKeys = new Set<string>();

const isBedBlockTypeId = (blockTypeId: string): boolean => {
    if (blockTypeId === "minecraft:bed") return true;
    return blockTypeId.endsWith("_bed");
};

const toLocationKey = (dimensionId: string, location: Vector3): string => {
    return `${dimensionId}:${location.x},${location.y},${location.z}`;
};

const clearAdjacentBedPart = (dimension: Dimension, center: Vector3): void => {
    const adjacentOffsets = [
        { x: 1, y: 0, z: 0 },
        { x: -1, y: 0, z: 0 },
        { x: 0, y: 0, z: 1 },
        { x: 0, y: 0, z: -1 }
    ];

    for (const offset of adjacentOffsets) {
        const adjacent = dimension.getBlock({
            x: center.x + offset.x,
            y: center.y + offset.y,
            z: center.z + offset.z
        });
        if (!adjacent) continue;
        if (!isBedBlockTypeId(adjacent.typeId)) continue;

        adjacent.setType("minecraft:air");
        return;
    }
};

const destroyBlockWithNaturalDrop = (dimension: Dimension, location: Vector3): void => {
    dimension.runCommand(`setblock ${location.x} ${location.y} ${location.z} air destroy`);
};

export const tryDestroyBedDuringObjective = (event: PlayerInteractWithBlockBeforeEvent): boolean => {
    const player = event.player;
    if (!player?.isValid) return false;

    const block = event.block;
    if (!block) return false;

    const interactedBlockTypeId = block.typeId;
    if (!isBedBlockTypeId(interactedBlockTypeId)) return false;

    const dimension = block.dimension;
    const location = {
        x: block.location.x,
        y: block.location.y,
        z: block.location.z
    };

    const locationKey = toLocationKey(dimension.id, location);
    if (pendingBedDestroyLocationKeys.has(locationKey)) return true;

    pendingBedDestroyLocationKeys.add(locationKey);

    system.runTimeout((): void => {
        pendingBedDestroyLocationKeys.delete(locationKey);
        if (!player.isValid) return;

        const currentBlock = dimension.getBlock(location);
        if (!currentBlock) return;
        if (!isBedBlockTypeId(currentBlock.typeId)) return;

        destroyBlockWithNaturalDrop(dimension, location);
        clearAdjacentBedPart(dimension, location);

        player.sendMessage(MESSAGE_BED_DESTROYED_DURING_OBJECTIVE);
    }, BED_DESTROY_DELAY_TICKS);

    return true;
};
