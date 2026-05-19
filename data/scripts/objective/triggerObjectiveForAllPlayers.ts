import { world } from "@minecraft/server";
import { triggerObjectiveForPlayer } from "./triggerObjectiveForPlayer";

export const triggerObjectiveForAllPlayers = (): void => {
    const players = world.getAllPlayers();
    for (const player of players) {
        triggerObjectiveForPlayer(player);
    }
};
