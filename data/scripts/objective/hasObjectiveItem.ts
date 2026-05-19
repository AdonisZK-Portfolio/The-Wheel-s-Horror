import { Player } from "@minecraft/server";
import { getInventoryComponent } from "../utils/inventory/getInventoryComponent";

export const hasObjectiveItem = (player: Player, itemId: string, requiredAmount: number): boolean => {
    const inventory = getInventoryComponent(player);
    if (!inventory) return false;

    const container = inventory.container;
    if (!container) return false;

    let totalAmount = 0;

    for (let slot = 0; slot < container.size; slot++) {
        const item = container.getItem(slot);
        if (!item) continue;
        if (item.typeId !== itemId) continue;
        if (item.amount <= 0) continue;

        totalAmount += item.amount;
        if (totalAmount >= requiredAmount) return true;
    }

    return false;
};
