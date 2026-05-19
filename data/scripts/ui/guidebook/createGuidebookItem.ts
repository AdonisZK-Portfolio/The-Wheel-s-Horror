import { ItemStack } from "@minecraft/server";
import { GUIDEBOOK_ITEM_TYPE_ID, GUIDEBOOK_NAME_TAG } from "../../config/guidebook";
import { GUIDEBOOK_ITEM_LORE } from "./guidebookStyle";

export const createGuidebookItem = (): ItemStack => {
    const item = new ItemStack(GUIDEBOOK_ITEM_TYPE_ID, 1);
    item.nameTag = GUIDEBOOK_NAME_TAG;
    item.setLore([...GUIDEBOOK_ITEM_LORE]);
    return item;
};
