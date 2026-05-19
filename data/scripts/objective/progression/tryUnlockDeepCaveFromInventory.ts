import { Player } from "@minecraft/server";
import { getInventoryComponent } from "../../utils/inventory/getInventoryComponent";
import { unlockPlayerProgressionKey } from "./unlockPlayerProgressionKey";

const DEEP_CAVE_UNLOCK_ITEM_IDS = new Set<string>([
    "minecraft:cobbled_deepslate",
    "minecraft:deepslate",
    "minecraft:tuff",
    "minecraft:calcite",
    "minecraft:dripstone_block",
    "minecraft:deepslate_coal_ore",
    "minecraft:deepslate_copper_ore",
    "minecraft:deepslate_iron_ore",
    "minecraft:deepslate_gold_ore",
    "minecraft:deepslate_lapis_ore",
    "minecraft:deepslate_redstone_ore",
    "minecraft:deepslate_diamond_ore",
    "minecraft:deepslate_emerald_ore"
]);

const hasDeepCaveEvidenceInInventory = (player: Player): boolean => {
    const inventory = getInventoryComponent(player);
    if (!inventory) return false;

    const container = inventory.container;
    if (!container) return false;

    for (let slot = 0; slot < container.size; slot++) {
        const item = container.getItem(slot);
        if (!item) continue;
        if (!DEEP_CAVE_UNLOCK_ITEM_IDS.has(item.typeId)) continue;
        return true;
    }

    return false;
};

export const tryUnlockDeepCaveFromInventory = (player: Player): void => {
    if (!player.isValid) return;
    if (!hasDeepCaveEvidenceInInventory(player)) return;
    unlockPlayerProgressionKey(player, "deep_cave");
};