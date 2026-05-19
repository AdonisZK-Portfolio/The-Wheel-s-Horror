import type { Player } from "@minecraft/server";
import { GUIDEBOOK_ITEM_TYPE_ID, GUIDEBOOK_NAME_TAG } from "../../config/guidebook";
import { getInventoryComponent } from "./getInventoryComponent";

export const hasGuidebook = (player: Player): boolean => {
    const inventory = getInventoryComponent(player);
    if (!inventory) return false;

    const container = inventory.container;
    if (!container) return false;

    for (let slot = 0; slot < container.size; slot++) {
        const item = container.getItem(slot);
        if (!item) continue;
        if (item.typeId !== GUIDEBOOK_ITEM_TYPE_ID) continue;
        if (item.nameTag !== GUIDEBOOK_NAME_TAG) continue;
        return true;
    }

    return false;
};
