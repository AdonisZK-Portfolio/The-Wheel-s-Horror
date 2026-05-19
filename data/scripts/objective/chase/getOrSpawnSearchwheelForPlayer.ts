import type { Entity, Player } from "@minecraft/server";
import { SEARCH_SEQUENCE_WHEEL_TYPE_ID } from "../../config/constants";
import { searchSequenceWheelEntityIdByPlayerId } from "../../state/searchSequencewheelEntityIdByPlayerId";
import { clearSearchWheelEntitiesForPlayerId } from "./clearSearchwheelEntitiesForPlayerId";
import { getSearchWheelOwnerTagForPlayerId } from "./getSearchwheelOwnerTagForPlayerId";
import { spawnSearchWheelForPlayer } from "./spawnSearchwheelForPlayer";

export const getOrSpawnSearchWheelForPlayer = (player: Player): Entity | undefined => {
    if (!player.isValid) return undefined;

    const ownerTag = getSearchWheelOwnerTagForPlayerId(player.id);
    const activeWheels = player.dimension.getEntities({
        type: SEARCH_SEQUENCE_WHEEL_TYPE_ID,
        tags: [ownerTag]
    });

    const firstWheel = activeWheels[0];
    if (firstWheel?.isValid) {
        searchSequenceWheelEntityIdByPlayerId.set(player.id, firstWheel.id);
        return firstWheel;
    }

    clearSearchWheelEntitiesForPlayerId(player.id);

    const spawnedWheel = spawnSearchWheelForPlayer(player);
    if (!spawnedWheel?.isValid) return undefined;

    searchSequenceWheelEntityIdByPlayerId.set(player.id, spawnedWheel.id);
    return spawnedWheel;
};
