import type { Vector3 } from "@minecraft/server";

export const getBlockLocationKey = (dimensionId: string, location: Vector3): string => {
    return `${dimensionId}:${location.x},${location.y},${location.z}`;
};
