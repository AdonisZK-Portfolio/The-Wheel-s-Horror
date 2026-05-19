import { EntityInventoryComponent, Player } from "@minecraft/server";

export const getInventoryComponent = (player: Player): EntityInventoryComponent | undefined => {
    const component = player.getComponent("inventory");
    if (!component) return undefined;
    if (!(component instanceof EntityInventoryComponent)) return undefined;
    return component;
};
