import { Player } from "@minecraft/server";
import { unlockPlayerProgressionKey } from "./unlockPlayerProgressionKey";

export const tryUnlockNetherFromDimension = (player: Player): void => {
    if (!player.isValid) return;
    if (player.dimension.id !== "minecraft:nether") return;
    unlockPlayerProgressionKey(player, "nether");
};
