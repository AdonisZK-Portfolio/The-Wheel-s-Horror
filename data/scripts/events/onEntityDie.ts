import { Player } from "@minecraft/server";
import type { EntityDieAfterEvent } from "@minecraft/server";
import { STALKER_STEVE_TYPE_ID } from "../config/constants";
import { stalkerSteveIsFrozenByEntityId } from "../creature/stalkerSteve/stalkerSteveIsFrozenByEntityId";
import { unlockPlayerProgressionKey } from "../objective/progression/unlockPlayerProgressionKey";
import { stopSearchSequenceForPlayer } from "../objective/chase/stopSearchSequenceForPlayer";

export const onEntityDie = (event: EntityDieAfterEvent): void => {
    const deadEntity = event.deadEntity;
    if (!deadEntity?.isValid) return;

    if (deadEntity instanceof Player) {
        stopSearchSequenceForPlayer(deadEntity.id);
        return;
    }

    if (deadEntity.typeId === STALKER_STEVE_TYPE_ID) {
        stalkerSteveIsFrozenByEntityId.delete(deadEntity.id);
        return;
    }

    if (deadEntity.typeId !== "minecraft:ender_dragon") return;

    const damageSource = event.damageSource;
    if (!damageSource) return;

    const damagingEntity = damageSource.damagingEntity;
    if (!(damagingEntity instanceof Player)) return;
    if (!damagingEntity.isValid) return;

    unlockPlayerProgressionKey(damagingEntity, "end");
};
