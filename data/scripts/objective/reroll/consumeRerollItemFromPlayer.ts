import type { Player } from "@minecraft/server";
import { REROLL_ITEM_NAME_TAG, REROLL_ITEM_TYPE_ID } from "../../config/rerollItem";
import { getInventoryComponent } from "../../utils/inventory/getInventoryComponent";

export const consumeRerollItemFromPlayer = (player: Player): boolean => {
    const inventory = getInventoryComponent(player);
    if (!inventory) return false;

    const container = inventory.container;
    if (!container) return false;

    for (let slot = 0; slot < container.size; slot++) {
        const item = container.getItem(slot);
        if (!item) continue;
        if (item.typeId !== REROLL_ITEM_TYPE_ID) continue;
        if (item.nameTag !== REROLL_ITEM_NAME_TAG) continue;

        if (item.amount <= 1) {
            container.setItem(slot);
            return true;
        }

        item.amount -= 1;
        container.setItem(slot, item);
        return true;
    }

    return false;
};
