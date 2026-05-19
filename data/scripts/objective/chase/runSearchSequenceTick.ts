import { world } from "@minecraft/server";
import { tickSearchSequenceForPlayer } from "./tickSearchSequenceForPlayer";

export const runSearchSequenceTick = (): void => {
    const players = world.getAllPlayers();
    for (const player of players) {
        tickSearchSequenceForPlayer(player);
    }
};