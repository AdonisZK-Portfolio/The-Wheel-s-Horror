import type { PlayerProgressionState } from "../../utils/types/PlayerProgressionState";

export const createDefaultPlayerProgressionState = (): PlayerProgressionState => {
    return {
        hasReachedNether: false,
        hasReachedJungle: false,
        hasReachedIronAge: false,
        hasReachedDeepCave: false,
        hasReachedDiamondAge: false,
        hasBeatDragon: false,
        hasSilkTouch: false,
        hasUnlockedEnchanting: false
    };
};
