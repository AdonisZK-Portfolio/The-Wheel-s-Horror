import type { Player } from "@minecraft/server";
import { REROLL_ITEM_NAME_TAG, REROLL_ITEM_TYPE_ID } from "../../config/rerollItem";
import { getInventoryComponent } from "../../utils/inventory/getInventoryComponent";

export const getRerollItemCount = (player: Player): number => {
    const inventory = getInventoryComponent(player);
    if (!inventory) return 0;

    const container = inventory.container;
    if (!container) return 0;

    let total = 0;
    for (let slot = 0; slot < container.size; slot++) {
        const item = container.getItem(slot);
        if (!item) continue;
        if (item.typeId !== REROLL_ITEM_TYPE_ID) continue;
        if (item.nameTag !== REROLL_ITEM_NAME_TAG) continue;
        total += item.amount;
    }

    return total;
};