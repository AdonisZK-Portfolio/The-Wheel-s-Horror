import { Player } from "@minecraft/server";
import { getInventoryComponent } from "../../utils/inventory/getInventoryComponent";
import { unlockPlayerProgressionKey } from "./unlockPlayerProgressionKey";

const JUNGLE_UNLOCK_ITEM_IDS = new Set<string>([
    "minecraft:bamboo",
    "minecraft:bamboo_block",
    "minecraft:stripped_bamboo_block",
    "minecraft:bamboo_planks",
    "minecraft:bamboo_mosaic",
    "minecraft:jungle_log",
    "minecraft:jungle_planks",
    "minecraft:cocoa_beans"
]);

const hasJungleEvidenceInInventory = (player: Player): boolean => {
    const inventory = getInventoryComponent(player);
    if (!inventory) return false;

    const container = inventory.container;
    if (!container) return false;

    for (let slot = 0; slot < container.size; slot++) {
        const item = container.getItem(slot);
        if (!item) continue;
        if (!JUNGLE_UNLOCK_ITEM_IDS.has(item.typeId)) continue;
        return true;
    }

    return false;
};

export const tryUnlockJungleFromInventory = (player: Player): void => {
    if (!player.isValid) return;
    if (!hasJungleEvidenceInInventory(player)) return;
    unlockPlayerProgressionKey(player, "jungle");
};