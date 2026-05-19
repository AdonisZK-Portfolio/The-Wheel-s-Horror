import { Player } from "@minecraft/server";
import { getInventoryComponent } from "../../utils/inventory/getInventoryComponent";
import { unlockPlayerProgressionKey } from "./unlockPlayerProgressionKey";

const IRON_AGE_UNLOCK_ITEM_IDS = new Set<string>([
    "minecraft:iron_ingot",
    "minecraft:iron_pickaxe",
    "minecraft:iron_axe",
    "minecraft:iron_shovel",
    "minecraft:iron_hoe",
    "minecraft:iron_sword",
    "minecraft:iron_helmet",
    "minecraft:iron_chestplate",
    "minecraft:iron_leggings",
    "minecraft:iron_boots",
    "minecraft:shield"
]);

const hasIronAgeEvidenceInInventory = (player: Player): boolean => {
    const inventory = getInventoryComponent(player);
    if (!inventory) return false;

    const container = inventory.container;
    if (!container) return false;

    for (let slot = 0; slot < container.size; slot++) {
        const item = container.getItem(slot);
        if (!item) continue;
        if (!IRON_AGE_UNLOCK_ITEM_IDS.has(item.typeId)) continue;
        return true;
    }

    return false;
};

export const tryUnlockIronAgeFromInventory = (player: Player): void => {
    if (!player.isValid) return;
    if (!hasIronAgeEvidenceInInventory(player)) return;
    unlockPlayerProgressionKey(player, "iron_age");
};