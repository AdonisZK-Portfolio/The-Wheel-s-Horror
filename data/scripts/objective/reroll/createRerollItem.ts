import { ItemStack } from "@minecraft/server";
import { REROLL_ITEM_NAME_TAG, REROLL_ITEM_TYPE_ID } from "../../config/rerollItem";

export const createRerollItem = (amount = 1): ItemStack => {
    const item = new ItemStack(REROLL_ITEM_TYPE_ID, amount);
    item.nameTag = REROLL_ITEM_NAME_TAG;
    return item;
};