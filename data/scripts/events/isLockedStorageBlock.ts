const isShulkerBox = (blockTypeId: string): boolean => {
    return blockTypeId === "minecraft:shulker_box" || blockTypeId.endsWith("_shulker_box");
};

export const isLockedStorageBlock = (blockTypeId: string): boolean => {
    if (blockTypeId === "minecraft:chest") return true;
    if (blockTypeId === "minecraft:trapped_chest") return true;
    if (blockTypeId === "minecraft:barrel") return true;
    if (isShulkerBox(blockTypeId)) return true;
    return false;
};
