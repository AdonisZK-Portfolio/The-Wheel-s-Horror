import { system, type Vector3 } from "@minecraft/server";
import { ANOMALY_EVENT_DISTANCE_FROM_PLAYER, ANOMALY_EVENT_TARGET_ATTEMPTS, TICKS_PER_SECOND } from "../config/constants";

export const buildAnomalyTargetCenters = (baseLocation: Vector3): Vector3[] => {
    const centers: Vector3[] = [];
    if (ANOMALY_EVENT_TARGET_ATTEMPTS <= 0) return centers;

    const baseX = Math.floor(baseLocation.x);
    const baseY = Math.floor(baseLocation.y);
    const baseZ = Math.floor(baseLocation.z);
    const currentSecond = Math.floor(system.currentTick / TICKS_PER_SECOND);
    const angleOffset = (currentSecond % ANOMALY_EVENT_TARGET_ATTEMPTS) * ((Math.PI * 2) / ANOMALY_EVENT_TARGET_ATTEMPTS);

    for (let index = 0; index < ANOMALY_EVENT_TARGET_ATTEMPTS; index++) {
        const angle = angleOffset + index * ((Math.PI * 2) / ANOMALY_EVENT_TARGET_ATTEMPTS);
        const x = Math.floor(baseX + Math.cos(angle) * ANOMALY_EVENT_DISTANCE_FROM_PLAYER);
        const z = Math.floor(baseZ + Math.sin(angle) * ANOMALY_EVENT_DISTANCE_FROM_PLAYER);
        centers.push({ x, y: baseY, z });
    }

    return centers;
};
