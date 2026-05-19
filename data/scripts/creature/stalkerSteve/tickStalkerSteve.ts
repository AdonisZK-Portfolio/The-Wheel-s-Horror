import { world, type Entity } from "@minecraft/server";
import {
    STALKER_STEVE_DISAPPEAR_CHANCE,
    STALKER_STEVE_FREEZE_EVENT,
    STALKER_STEVE_UNFREEZE_EVENT
} from "../../config/constants";
import { isPlayerLookingAtEntity } from "./isPlayerLookingAtEntity";
import { stalkerSteveIsFrozenByEntityId } from "./stalkerSteveIsFrozenByEntityId";

const isAnyPlayerLookingAt = (entity: Entity): boolean => {
    for (const player of world.getAllPlayers()) {
        if (!player.isValid) continue;
        if (player.dimension.id !== entity.dimension.id) continue;
        if (isPlayerLookingAtEntity(player, entity)) return true;
    }
    return false;
};

export const tickStalkerSteve = (entity: Entity): void => {
    if (!entity.isValid) return;

    const wasFrozen = stalkerSteveIsFrozenByEntityId.get(entity.id) ?? false;
    const shouldBeFrozen = isAnyPlayerLookingAt(entity);

    if (shouldBeFrozen === wasFrozen) return;

    if (wasFrozen && !shouldBeFrozen && Math.random() < STALKER_STEVE_DISAPPEAR_CHANCE) {
        stalkerSteveIsFrozenByEntityId.delete(entity.id);
        entity.remove();
        return;
    }

    stalkerSteveIsFrozenByEntityId.set(entity.id, shouldBeFrozen);
    entity.triggerEvent(shouldBeFrozen ? STALKER_STEVE_FREEZE_EVENT : STALKER_STEVE_UNFREEZE_EVENT);
};
