import { ItemEnchantableComponent, Player } from "@minecraft/server";
import { getInventoryComponent } from "../../utils/inventory/getInventoryComponent";
import { unlockPlayerProgressionKey } from "./unlockPlayerProgressionKey";

const hasSilkTouchInInventory = (player: Player): boolean => {
    const inventory = getInventoryComponent(player);
    if (!inventory) return false;

    const container = inventory.container;
    if (!container) return false;

    for (let slot = 0; slot < container.size; slot++) {
        const item = container.getItem(slot);
        if (!item) continue;

        const enchantable = item.getComponent("enchantable");
        if (!(enchantable instanceof ItemEnchantableComponent)) continue;

        const silkTouch = enchantable.getEnchantment("silk_touch");
        if (!silkTouch) continue;
        return true;
    }

    return false;
};

export const tryUnlockSilkTouchFromInventory = (player: Player): void => {
    if (!player.isValid) return;
    if (!hasSilkTouchInInventory(player)) return;
    unlockPlayerProgressionKey(player, "silk_touch");
};
