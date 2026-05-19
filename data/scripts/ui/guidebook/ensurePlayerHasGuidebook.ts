import type { Player } from "@minecraft/server";
import { GUIDEBOOK_ITEM_TYPE_ID, GUIDEBOOK_NAME_TAG } from "../../config/guidebook";
import { MESSAGE_GUIDEBOOK_GIVEN } from "../../config/messages";
import { createGuidebookItem } from "./createGuidebookItem";
import { getInventoryComponent } from "../../utils/inventory/getInventoryComponent";

const refreshExistingGuidebook = (player: Player): boolean => {
    const inventory = getInventoryComponent(player);
    if (!inventory) return false;

    const container = inventory.container;
    if (!container) return false;

    for (let slot = 0; slot < container.size; slot++) {
        const item = container.getItem(slot);
        if (!item) continue;
        if (item.typeId !== GUIDEBOOK_ITEM_TYPE_ID) continue;
        if (item.nameTag !== GUIDEBOOK_NAME_TAG) continue;

        container.setItem(slot, createGuidebookItem());
        return true;
    }

    return false;
};

export const ensurePlayerHasGuidebook = (player: Player): void => {
    if (!player.isValid) return;
    if (refreshExistingGuidebook(player)) return;

    const inventory = getInventoryComponent(player);
    if (!inventory) return;

    const container = inventory.container;
    if (!container) return;

    container.addItem(createGuidebookItem());
    player.sendMessage(MESSAGE_GUIDEBOOK_GIVEN);
};
