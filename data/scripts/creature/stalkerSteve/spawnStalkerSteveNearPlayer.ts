import { EntityEquippableComponent, EquipmentSlot, ItemStack, type Player } from "@minecraft/server";
import { STALKER_STEVE_SPAWN_DISTANCE, STALKER_STEVE_TYPE_ID } from "../../config/constants";

const TWO_PI = Math.PI * 2;

export const spawnStalkerSteveNearPlayer = (player: Player): void => {
    if (!player.isValid) return;

    const angle = Math.random() * TWO_PI;
    const baseX = Math.floor(player.location.x + Math.cos(angle) * STALKER_STEVE_SPAWN_DISTANCE);
    const baseY = Math.floor(player.location.y);
    const baseZ = Math.floor(player.location.z + Math.sin(angle) * STALKER_STEVE_SPAWN_DISTANCE);

    for (let yOffset = 2; yOffset >= -3; yOffset--) {
        const spawnY = baseY + yOffset;
        const feet = player.dimension.getBlock({ x: baseX, y: spawnY, z: baseZ });
        const head = player.dimension.getBlock({ x: baseX, y: spawnY + 1, z: baseZ });
        const support = player.dimension.getBlock({ x: baseX, y: spawnY - 1, z: baseZ });
        if (!feet || !head || !support) continue;
        if (feet.typeId !== "minecraft:air") continue;
        if (head.typeId !== "minecraft:air") continue;
        if (support.typeId === "minecraft:air") continue;

        const stalkerSteve = player.dimension.spawnEntity(STALKER_STEVE_TYPE_ID, {
            x: baseX + 0.5,
            y: spawnY,
            z: baseZ + 0.5
        });
        if (!stalkerSteve?.isValid) return;

        stalkerSteve.nameTag = "Steve";
        stalkerSteve.triggerEvent("stalker:unfreeze");
        const equippable = stalkerSteve.getComponent("equippable") as EntityEquippableComponent | undefined;
        equippable?.setEquipment(EquipmentSlot.Mainhand, new ItemStack("minecraft:diamond_sword"));
        return;
    }
};
