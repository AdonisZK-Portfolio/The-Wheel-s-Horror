import { world } from "@minecraft/server";
import { STALKER_STEVE_TYPE_ID } from "../../config/constants";
import { tickStalkerSteve } from "./tickStalkerSteve";

export const runStalkerSteveTick = (): void => {
    const checkedDimensionIds = new Set<string>();
    for (const player of world.getAllPlayers()) {
        if (!player.isValid) continue;
        const dimId = player.dimension.id;
        if (checkedDimensionIds.has(dimId)) continue;
        checkedDimensionIds.add(dimId);
        const stalkerSteves = player.dimension.getEntities({ type: STALKER_STEVE_TYPE_ID });
        for (const stalkerSteve of stalkerSteves) {
            tickStalkerSteve(stalkerSteve);
        }
    }
};
