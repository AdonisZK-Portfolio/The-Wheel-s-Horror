import { playerProgressionById } from "../../state/playerProgressionById";
import type { PlayerProgressionState } from "../../utils/types/PlayerProgressionState";
import { createDefaultPlayerProgressionState } from "./createDefaultPlayerProgressionState";

export const getOrCreatePlayerProgressionState = (playerId: string): PlayerProgressionState => {
    const existingState = playerProgressionById.get(playerId);
    if (existingState) return existingState;

    const defaultState = createDefaultPlayerProgressionState();
    playerProgressionById.set(playerId, defaultState);
    return defaultState;
};
