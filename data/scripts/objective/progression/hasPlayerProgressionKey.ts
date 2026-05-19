import type { ProgressionKey } from "../../utils/types/ProgressionKey";
import { getOrCreatePlayerProgressionState } from "./getOrCreatePlayerProgressionState";

export const hasPlayerProgressionKey = (playerId: string, key: ProgressionKey): boolean => {
    const state = getOrCreatePlayerProgressionState(playerId);
    if (key === "nether") return state.hasReachedNether;
    if (key === "jungle") return state.hasReachedJungle;
    if (key === "iron_age") return state.hasReachedIronAge;
    if (key === "deep_cave") return state.hasReachedDeepCave;
    if (key === "diamond_age") return state.hasReachedDiamondAge;
    if (key === "end") return state.hasBeatDragon;
    if (key === "silk_touch") return state.hasSilkTouch;
    return state.hasUnlockedEnchanting;
};
