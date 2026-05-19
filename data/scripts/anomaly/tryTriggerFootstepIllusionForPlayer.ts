import { system, type Player } from "@minecraft/server";
import {
    ANOMALY_EVENT_FOOTSTEP_DEFAULT_SOUND_ID,
    ANOMALY_EVENT_FOOTSTEP_END_MAX_DISTANCE,
    ANOMALY_EVENT_FOOTSTEP_END_MIN_DISTANCE,
    ANOMALY_EVENT_FOOTSTEP_INTERVAL_TICKS,
    ANOMALY_EVENT_FOOTSTEP_MAX_DURATION_SECONDS,
    ANOMALY_EVENT_FOOTSTEP_MIN_DURATION_SECONDS,
    ANOMALY_EVENT_FOOTSTEP_START_MAX_DISTANCE,
    ANOMALY_EVENT_FOOTSTEP_START_MIN_DISTANCE,
    TICKS_PER_SECOND
} from "../config/constants";
import { randomInt } from "../utils/randomInt";

const FOOTSTEP_STANDING_SAMPLE_OFFSETS: readonly { x: number; z: number }[] = [
    { x: 0, z: 0 },
    { x: 0.3, z: 0 },
    { x: -0.3, z: 0 },
    { x: 0, z: 0.3 },
    { x: 0, z: -0.3 }
];

const getStandingBlockTypeId = (player: Player): string | undefined => {
    const sampleY = Math.floor(player.location.y) - 1;
    const blockTypeCounts = new Map<string, number>();

    for (const offset of FOOTSTEP_STANDING_SAMPLE_OFFSETS) {
        const block = player.dimension.getBlock({
            x: Math.floor(player.location.x + offset.x),
            y: sampleY,
            z: Math.floor(player.location.z + offset.z)
        });
        if (!block) continue;
        if (block.typeId === "minecraft:air") continue;

        const existingCount = blockTypeCounts.get(block.typeId) ?? 0;
        blockTypeCounts.set(block.typeId, existingCount + 1);
    }

    if (blockTypeCounts.size === 0) return undefined;

    let selectedTypeId: string | undefined;
    let selectedCount = -1;
    for (const [typeId, count] of blockTypeCounts) {
        if (count <= selectedCount) continue;
        selectedTypeId = typeId;
        selectedCount = count;
    }

    return selectedTypeId;
};

const resolveFootstepSoundFromStandingBlock = (player: Player): string => {
    const typeId = getStandingBlockTypeId(player);
    if (!typeId) return ANOMALY_EVENT_FOOTSTEP_DEFAULT_SOUND_ID;

    if (typeId.includes("deepslate")) return "step.deepslate";
    if (typeId.includes("diorite")) return "step.stone";
    if (typeId.includes("andesite")) return "step.stone";
    if (typeId.includes("granite")) return "step.stone";
    if (typeId.includes("cobblestone")) return "step.stone";
    if (typeId.includes("stone")) return "step.stone";
    if (typeId.includes("tuff")) return "step.stone";
    if (typeId.includes("calcite")) return "step.stone";
    if (typeId.includes("dripstone")) return "step.stone";
    if (typeId.includes("nether_brick")) return "step.nether_brick";
    if (typeId.includes("moss")) return "step.moss";
    if (typeId.includes("grass")) return "step.grass";
    if (typeId.includes("gravel")) return "step.gravel";
    if (typeId.includes("sand")) return "step.gravel";
    if (typeId.includes("dirt")) return "step.gravel";

    return ANOMALY_EVENT_FOOTSTEP_DEFAULT_SOUND_ID;
};

export const tryTriggerFootstepIllusionForPlayer = (player: Player): boolean => {
    if (!player.isValid) return false;

    const durationSeconds = randomInt(ANOMALY_EVENT_FOOTSTEP_MIN_DURATION_SECONDS, ANOMALY_EVENT_FOOTSTEP_MAX_DURATION_SECONDS);
    const durationTicks = durationSeconds * TICKS_PER_SECOND;
    const endTick = system.currentTick + durationSeconds * TICKS_PER_SECOND;
    const totalStepCount = Math.max(Math.floor(durationTicks / ANOMALY_EVENT_FOOTSTEP_INTERVAL_TICKS), 1);
    const startDistance = randomInt(ANOMALY_EVENT_FOOTSTEP_START_MIN_DISTANCE, ANOMALY_EVENT_FOOTSTEP_START_MAX_DISTANCE);
    const endDistance = randomInt(ANOMALY_EVENT_FOOTSTEP_END_MIN_DISTANCE, ANOMALY_EVENT_FOOTSTEP_END_MAX_DISTANCE);
    const effectiveStartDistance = Math.max(startDistance, endDistance + 1);
    let currentStep = 0;

    const intervalId = system.runInterval(() => {
        if (!player.isValid) {
            system.clearRun(intervalId);
            return;
        }

        if (system.currentTick >= endTick) {
            system.clearRun(intervalId);
            return;
        }

        const viewDirection = player.getViewDirection();
        const horizontalLength = Math.sqrt(viewDirection.x * viewDirection.x + viewDirection.z * viewDirection.z);
        if (horizontalLength <= 0) return;

        const normalizedX = viewDirection.x / horizontalLength;
        const normalizedZ = viewDirection.z / horizontalLength;
        const stepProgress = totalStepCount <= 1 ? 1 : Math.min(currentStep / (totalStepCount - 1), 1);
        const interpolatedDistance = effectiveStartDistance
            - (effectiveStartDistance - endDistance) * stepProgress;
        const distanceBehind = Math.max(endDistance, Math.round(interpolatedDistance));
        const selectedSound = resolveFootstepSoundFromStandingBlock(player);

        player.dimension.playSound(selectedSound, {
            x: player.location.x - normalizedX * distanceBehind,
            y: player.location.y,
            z: player.location.z - normalizedZ * distanceBehind
        }, {
            volume: 0.35,
            pitch: 1
        });

        currentStep++;
    }, ANOMALY_EVENT_FOOTSTEP_INTERVAL_TICKS);

    return true;
};
