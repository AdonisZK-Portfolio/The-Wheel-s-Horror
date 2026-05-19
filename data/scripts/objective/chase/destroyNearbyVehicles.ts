import { ItemStack, type Entity, type EntityRidingComponent, type EntityVariantComponent } from "@minecraft/server";

const BOAT_VARIANT_ITEM_IDS: ReadonlyMap<number, string> = new Map([
    [0, "minecraft:oak_boat"],
    [1, "minecraft:spruce_boat"],
    [2, "minecraft:birch_boat"],
    [3, "minecraft:jungle_boat"],
    [4, "minecraft:acacia_boat"],
    [5, "minecraft:dark_oak_boat"],
    [6, "minecraft:mangrove_boat"],
    [7, "minecraft:bamboo_raft"],
    [8, "minecraft:cherry_boat"],
    [9, "minecraft:pale_oak_boat"],
]);

const CHEST_BOAT_VARIANT_ITEM_IDS: ReadonlyMap<number, string> = new Map([
    [0, "minecraft:oak_chest_boat"],
    [1, "minecraft:spruce_chest_boat"],
    [2, "minecraft:birch_chest_boat"],
    [3, "minecraft:jungle_chest_boat"],
    [4, "minecraft:acacia_chest_boat"],
    [5, "minecraft:dark_oak_chest_boat"],
    [6, "minecraft:mangrove_chest_boat"],
    [7, "minecraft:bamboo_chest_raft"],
    [8, "minecraft:cherry_chest_boat"],
    [9, "minecraft:pale_oak_chest_boat"],
]);

const MINECART_TYPE_ITEM_IDS: ReadonlyMap<string, string> = new Map([
    ["minecraft:minecart", "minecraft:minecart"],
    ["minecraft:chest_minecart", "minecraft:minecart"],
    ["minecraft:hopper_minecart", "minecraft:minecart"],
    ["minecraft:tnt_minecart", "minecraft:minecart"],
    ["minecraft:command_block_minecart", "minecraft:minecart"],
]);

const VEHICLE_TYPE_IDS = new Set<string>([
    "minecraft:boat",
    "minecraft:chest_boat",
    ...MINECART_TYPE_ITEM_IDS.keys(),
]);

const VEHICLE_PROXIMITY_RADIUS = 2;

const getEntityVariant = (entity: Entity): number => {
    const variantComponent = entity.getComponent("variant") as EntityVariantComponent | undefined;
    return variantComponent?.value ?? 0;
};

const getBoatDropItemId = (entity: Entity): string => {
    const variant = getEntityVariant(entity);
    return BOAT_VARIANT_ITEM_IDS.get(variant) ?? "minecraft:oak_boat";
};

const getChestBoatDropItemId = (entity: Entity): string => {
    const variant = getEntityVariant(entity);
    return CHEST_BOAT_VARIANT_ITEM_IDS.get(variant) ?? "minecraft:oak_chest_boat";
};

const destroyVehicleWithDrop = (entity: Entity): void => {
    if (!entity.isValid) return;

    const typeId = entity.typeId;
    const location = entity.location;
    const dimension = entity.dimension;

    let itemId: string | undefined;

    if (typeId === "minecraft:boat") {
        itemId = getBoatDropItemId(entity);
    } else if (typeId === "minecraft:chest_boat") {
        itemId = getChestBoatDropItemId(entity);
    } else {
        itemId = MINECART_TYPE_ITEM_IDS.get(typeId);
    }

    if (!itemId) return;

    entity.remove();
    dimension.spawnItem(new ItemStack(itemId, 1), location);
};

export const destroyNearbyVehicles = (wheel: Entity): void => {
    if (!wheel.isValid) return;

    const ridingComponent = wheel.getComponent("riding") as EntityRidingComponent | undefined;
    if (ridingComponent) {
        const vehicle = ridingComponent.entityRidingOn;
        if (vehicle?.isValid && VEHICLE_TYPE_IDS.has(vehicle.typeId)) {
            destroyVehicleWithDrop(vehicle);
            return;
        }
    }

    const nearby = wheel.dimension.getEntities({
        location: wheel.location,
        maxDistance: VEHICLE_PROXIMITY_RADIUS,
    });

    for (const entity of nearby) {
        if (!entity.isValid) continue;
        if (!VEHICLE_TYPE_IDS.has(entity.typeId)) continue;
        destroyVehicleWithDrop(entity);
    }
};
