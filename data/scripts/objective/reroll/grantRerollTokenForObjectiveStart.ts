import type { Player } from "@minecraft/server";
import { REROLL_GRANT_PER_OBJECTIVE } from "../../config/constants";
import { getInventoryComponent } from "../../utils/inventory/getInventoryComponent";
import { createRerollItem } from "./createRerollItem";

export const grantRerollTokenForObjectiveStart = (player: Player): void => {
    if (!player.isValid) return;

    const inventory = getInventoryComponent(player);
    if (!inventory) return;

    const container = inventory.container;
    if (!container) return;

    const overflow = container.addItem(createRerollItem(REROLL_GRANT_PER_OBJECTIVE));
    if (!overflow) return;

    player.dimension.spawnItem(overflow, player.location);
};
