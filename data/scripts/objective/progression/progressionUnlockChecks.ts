import type { Player } from "@minecraft/server";
import { tryUnlockNetherFromDimension } from "./tryUnlockNetherFromDimension";
import { tryUnlockJungleFromInventory } from "./tryUnlockJungleFromInventory";
import { tryUnlockIronAgeFromInventory } from "./tryUnlockIronAgeFromInventory";
import { tryUnlockDeepCaveFromInventory } from "./tryUnlockDeepCaveFromInventory";
import { tryUnlockDiamondAgeFromInventory } from "./tryUnlockDiamondAgeFromInventory";
import { tryUnlockEnchantingFromInventory } from "./tryUnlockEnchantingFromInventory";
import { tryUnlockSilkTouchFromInventory } from "./tryUnlockSilkTouchFromInventory";

type ProgressionUnlockCheck = (player: Player) => void;

export const progressionUnlockChecks: readonly ProgressionUnlockCheck[] = [
    tryUnlockNetherFromDimension,
    tryUnlockJungleFromInventory,
    tryUnlockIronAgeFromInventory,
    tryUnlockDeepCaveFromInventory,
    tryUnlockDiamondAgeFromInventory,
    tryUnlockEnchantingFromInventory,
    tryUnlockSilkTouchFromInventory
];
