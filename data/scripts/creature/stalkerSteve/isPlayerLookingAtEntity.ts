import type { Entity, Player } from "@minecraft/server";
import { STALKER_STEVE_LOOK_MAX_DISTANCE } from "../../config/constants";

const EYE_HEIGHT = 1.62;
const EYE_HIT_RADIUS = 0.5;

export const isPlayerLookingAtEntity = (player: Player, entity: Entity): boolean => {
    const pLoc = player.location;
    const eLoc = entity.location;

    const eyeX = pLoc.x;
    const eyeY = pLoc.y + EYE_HEIGHT;
    const eyeZ = pLoc.z;

    const targetX = eLoc.x;
    const targetY = eLoc.y + EYE_HEIGHT;
    const targetZ = eLoc.z;

    const dx = targetX - eyeX;
    const dy = targetY - eyeY;
    const dz = targetZ - eyeZ;

    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (distance > STALKER_STEVE_LOOK_MAX_DISTANCE) return false;
    if (distance <= 0) return false;

    const viewDir = player.getViewDirection();
    const t = viewDir.x * dx + viewDir.y * dy + viewDir.z * dz;
    if (t < 0) return false;

    const closestX = eyeX + viewDir.x * t;
    const closestY = eyeY + viewDir.y * t;
    const closestZ = eyeZ + viewDir.z * t;

    const perpDist = Math.sqrt(
        (closestX - targetX) ** 2 +
        (closestY - targetY) ** 2 +
        (closestZ - targetZ) ** 2
    );

    return perpDist <= EYE_HIT_RADIUS;
};
