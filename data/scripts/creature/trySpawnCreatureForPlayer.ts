import { system, type Player } from "@minecraft/server";
import { CREATURE_SPAWN_COOLDOWN_SECONDS, TICKS_PER_SECOND } from "../config/constants";
import { creatureSpawnNextAllowedTickByPlayerId } from "../state/creatureSpawnNextAllowedTickByPlayerId";
import { getCreatureSpawnChancePerSecond } from "./getCreatureSpawnChancePerSecond";
import { spawnStalkerSteveNearPlayer } from "./stalkerSteve/spawnStalkerSteveNearPlayer";

export const trySpawnCreatureForPlayer = (player: Player): void => {
    if (!player.isValid) return;

    const currentTick = system.currentTick;
    const nextAllowedTick = creatureSpawnNextAllowedTickByPlayerId.get(player.id) ?? 0;
    if (currentTick < nextAllowedTick) return;

    const chancePerSecond = getCreatureSpawnChancePerSecond(player.id, currentTick);
    if (chancePerSecond <= 0) return;
    if (Math.random() > chancePerSecond) return;

    spawnStalkerSteveNearPlayer(player);
    creatureSpawnNextAllowedTickByPlayerId.set(
        player.id,
        currentTick + CREATURE_SPAWN_COOLDOWN_SECONDS * TICKS_PER_SECOND
    );
};
