import type { PlayerBreakBlockBeforeEvent } from "@minecraft/server";
import { MESSAGE_STORAGE_BREAK_LOCKED_DURING_OBJECTIVE } from "../config/messages";
import { usesStorageLockByDifficulty } from "../config/settings";
import { hasActiveObjectiveForPlayer } from "../objective/hasActiveObjectiveForPlayer";
import { untrackBrokenOakLog } from "../anomaly/untrackBrokenOakLog";
import { isLockedStorageBlock } from "./isLockedStorageBlock";

export const onPlayerBreakBlock = (event: PlayerBreakBlockBeforeEvent): void => {
    const player = event.player;
    if (!player?.isValid) return;

    untrackBrokenOakLog(event);

    if (!usesStorageLockByDifficulty()) return;

    if (!hasActiveObjectiveForPlayer(player.id)) return;

    const block = event.block;
    if (!block) return;

    if (!isLockedStorageBlock(block.typeId)) return;

    event.cancel = true;
    player.sendMessage(MESSAGE_STORAGE_BREAK_LOCKED_DURING_OBJECTIVE);
};
