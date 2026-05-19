import {
    ItemEnchantableComponent,
    Player
} from "@minecraft/server";
import { getInventoryComponent } from "../../utils/inventory/getInventoryComponent";
import { unlockPlayerProgressionKey } from "./unlockPlayerProgressionKey";

const ENCHANTING_UNLOCK_REQUIRED_ITEMS = 3;

const hasEnchantedItemInInventory = (player: Player): boolean => {
    const inventory = getInventoryComponent(player);
    if (!inventory) return false;

    const container = inventory.container;
    if (!container) return false;

    let enchantedItemCount = 0;

    for (let slot = 0; slot < container.size; slot++) {
        const item = container.getItem(slot);
        if (!item) continue;
        if (item.typeId === "minecraft:enchanted_book") continue;

        const enchantable = item.getComponent("enchantable");
        if (!(enchantable instanceof ItemEnchantableComponent)) continue;
        if (enchantable.getEnchantments().length <= 0) continue;

        enchantedItemCount += item.amount;
        if (enchantedItemCount >= ENCHANTING_UNLOCK_REQUIRED_ITEMS) return true;
    }

    return false;
};

export const tryUnlockEnchantingFromInventory = (player: Player): void => {
    if (!player.isValid) return;
    if (!hasEnchantedItemInInventory(player)) return;
    unlockPlayerProgressionKey(player, "enchanting");
};