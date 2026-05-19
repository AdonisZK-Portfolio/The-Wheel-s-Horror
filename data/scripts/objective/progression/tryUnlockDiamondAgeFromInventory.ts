import { Player } from "@minecraft/server";
import { getInventoryComponent } from "../../utils/inventory/getInventoryComponent";
import { unlockPlayerProgressionKey } from "./unlockPlayerProgressionKey";

const DIAMOND_AGE_UNLOCK_ITEM_IDS = new Set<string>([
    "minecraft:diamond",
    "minecraft:diamond_pickaxe",
    "minecraft:diamond_axe",
    "minecraft:diamond_shovel",
    "minecraft:diamond_hoe",
    "minecraft:diamond_sword",
    "minecraft:diamond_helmet",
    "minecraft:diamond_chestplate",
    "minecraft:diamond_leggings",
    "minecraft:diamond_boots"
]);

const hasDiamondAgeEvidenceInInventory = (player: Player): boolean => {
    const inventory = getInventoryComponent(player);
    if (!inventory) return false;

    const container = inventory.container;
    if (!container) return false;

    for (let slot = 0; slot < container.size; slot++) {
        const item = container.getItem(slot);
        if (!item) continue;
        if (!DIAMOND_AGE_UNLOCK_ITEM_IDS.has(item.typeId)) continue;
        return true;
    }

    return false;
};

export const tryUnlockDiamondAgeFromInventory = (player: Player): void => {
    if (!player.isValid) return;
    if (!hasDiamondAgeEvidenceInInventory(player)) return;
    unlockPlayerProgressionKey(player, "diamond_age");
};