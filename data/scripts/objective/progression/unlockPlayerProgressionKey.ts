import { Player } from "@minecraft/server";
import {
    MESSAGE_POOL_UNLOCKED_DEEP_CAVE,
    MESSAGE_POOL_UNLOCKED_DIAMOND_AGE,
    MESSAGE_POOL_UNLOCKED_END,
    MESSAGE_POOL_UNLOCKED_ENCHANTING,
    MESSAGE_POOL_UNLOCKED_IRON_AGE,
    MESSAGE_POOL_UNLOCKED_JUNGLE,
    MESSAGE_POOL_UNLOCKED_NETHER,
    MESSAGE_POOL_UNLOCKED_SILK_TOUCH
} from "../../config/messages";
import type { ProgressionKey } from "../../utils/types/ProgressionKey";
import { getOrCreatePlayerProgressionState } from "./getOrCreatePlayerProgressionState";

const getUnlockMessage = (key: ProgressionKey): string => {
    if (key === "nether") return MESSAGE_POOL_UNLOCKED_NETHER;
    if (key === "jungle") return MESSAGE_POOL_UNLOCKED_JUNGLE;
    if (key === "iron_age") return MESSAGE_POOL_UNLOCKED_IRON_AGE;
    if (key === "deep_cave") return MESSAGE_POOL_UNLOCKED_DEEP_CAVE;
    if (key === "diamond_age") return MESSAGE_POOL_UNLOCKED_DIAMOND_AGE;
    if (key === "end") return MESSAGE_POOL_UNLOCKED_END;
    if (key === "silk_touch") return MESSAGE_POOL_UNLOCKED_SILK_TOUCH;
    return MESSAGE_POOL_UNLOCKED_ENCHANTING;
};

export const unlockPlayerProgressionKey = (player: Player, key: ProgressionKey): void => {
    if (!player.isValid) return;

    const state = getOrCreatePlayerProgressionState(player.id);
    if (key === "nether") {
        if (state.hasReachedNether) return;
        state.hasReachedNether = true;
    } else if (key === "jungle") {
        if (state.hasReachedJungle) return;
        state.hasReachedJungle = true;
    } else if (key === "iron_age") {
        if (state.hasReachedIronAge) return;
        state.hasReachedIronAge = true;
    } else if (key === "deep_cave") {
        if (state.hasReachedDeepCave) return;
        state.hasReachedDeepCave = true;
    } else if (key === "diamond_age") {
        if (state.hasReachedDiamondAge) return;
        state.hasReachedDiamondAge = true;
    } else if (key === "end") {
        if (state.hasBeatDragon) return;
        state.hasBeatDragon = true;
    } else if (key === "silk_touch") {
        if (state.hasSilkTouch) return;
        state.hasSilkTouch = true;
    } else {
        if (state.hasUnlockedEnchanting) return;
        state.hasUnlockedEnchanting = true;
    }

    player.sendMessage(getUnlockMessage(key));
};
