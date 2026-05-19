import type { Player } from "@minecraft/server";
import { STALKER_STEVE_KILL_RADIUS, STALKER_STEVE_TYPE_ID } from "../../config/constants";
import { stalkerSteveIsFrozenByEntityId } from "./stalkerSteveIsFrozenByEntityId";

export const killAllStalkerSteveNearPlayer = (player: Player): void => {
    if (!player.isValid) return;

    const stalkerSteves = player.dimension.getEntities({
        type: STALKER_STEVE_TYPE_ID,
        location: player.location,
        maxDistance: STALKER_STEVE_KILL_RADIUS
    });

    for (const stalkerSteve of stalkerSteves) {
        if (!stalkerSteve.isValid) continue;
        stalkerSteveIsFrozenByEntityId.delete(stalkerSteve.id);
        stalkerSteve.kill();
    }
};
