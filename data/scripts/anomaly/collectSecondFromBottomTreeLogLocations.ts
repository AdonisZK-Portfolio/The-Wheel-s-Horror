import type { Player, Vector3 } from "@minecraft/server";
import { buildAnomalyTargetCenters } from "./buildAnomalyTargetCenters";
import { collectSecondFromBottomTreeLogLocationsInArea } from "./collectSecondFromBottomTreeLogLocationsInArea";

export const collectSecondFromBottomTreeLogLocations = (player: Player): Vector3[] => {
    const targetCenters = buildAnomalyTargetCenters(player.location);
    const secondFromBottomByLocation = new Map<string, Vector3>();

    for (const center of targetCenters) {
        const logs = collectSecondFromBottomTreeLogLocationsInArea(player, center);
        if (logs.length === 0) continue;

        for (const location of logs) {
            const key = `${location.x},${location.y},${location.z}`;
            secondFromBottomByLocation.set(key, location);
        }
    }

    return Array.from(secondFromBottomByLocation.values());
};
