import { world } from "@minecraft/server";
import { SEARCH_SEQUENCE_WHEEL_TYPE_ID } from "../../config/constants";
import { getSearchWheelOwnerTagForPlayerId } from "./getSearchwheelOwnerTagForPlayerId";

const SEARCH_SEQUENCE_DIMENSION_IDS = ["overworld", "nether", "the_end"] as const;

export const clearSearchWheelEntitiesForPlayerId = (playerId: string): void => {
    const ownerTag = getSearchWheelOwnerTagForPlayerId(playerId);

    for (const dimensionId of SEARCH_SEQUENCE_DIMENSION_IDS) {
        const dimension = world.getDimension(dimensionId);
        const wheels = dimension.getEntities({
            type: SEARCH_SEQUENCE_WHEEL_TYPE_ID,
            tags: [ownerTag]
        });

        for (const wheel of wheels) {
            if (!wheel.isValid) continue;
            wheel.remove();
        }
    }
};
