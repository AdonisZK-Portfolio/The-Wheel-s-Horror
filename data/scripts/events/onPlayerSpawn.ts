import type { PlayerSpawnAfterEvent } from "@minecraft/server";
import { ensurePlayerHasGuidebook } from "../ui/guidebook/ensurePlayerHasGuidebook.ts";
import { scheduleNextTrigger } from "../objective/scheduleNextTrigger";
import { getOrCreatePlayerProgressionState } from "../objective/progression/getOrCreatePlayerProgressionState";
import { tryUnlockNetherFromDimension } from "../objective/progression/tryUnlockNetherFromDimension";
import { activeObjectives } from "../state/activeObjectives";
import { nextTriggerTickByPlayer } from "../state/nextTriggerTickByPlayer";
import { currentTick } from "../utils/time/currentTick";
import { restorePlayerStateOnSpawn } from "./restorePlayerStateOnSpawn";

export const onPlayerSpawn = (event: PlayerSpawnAfterEvent): void => {
    const player = event.player;
    if (!player.isValid) return;

    ensurePlayerHasGuidebook(player);
    restorePlayerStateOnSpawn(player);

    getOrCreatePlayerProgressionState(player.id);
    tryUnlockNetherFromDimension(player);

    if (activeObjectives.has(player.id)) return;

    if (nextTriggerTickByPlayer.has(player.id)) return;
    scheduleNextTrigger(player.id, currentTick());
};
