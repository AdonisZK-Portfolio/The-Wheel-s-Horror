import type { PlayerInteractWithBlockBeforeEvent } from "@minecraft/server";
import { MESSAGE_STORAGE_LOCKED_DURING_OBJECTIVE } from "../config/messages";
import { hasActiveObjectiveForPlayer } from "../objective/hasActiveObjectiveForPlayer";
import { usesStorageLockByDifficulty } from "../config/settings";
import { isLockedStorageBlock } from "./isLockedStorageBlock";
import { tryDestroyBedDuringObjective } from "./tryDestroyBedDuringObjective";

export const onPlayerInteractWithBlock = (event: PlayerInteractWithBlockBeforeEvent): void => {
    const player = event.player;
    if (!player?.isValid) return;
    if (!hasActiveObjectiveForPlayer(player.id)) return;

    if (tryDestroyBedDuringObjective(event)) return;

    if (!usesStorageLockByDifficulty()) return;

    const block = event.block;
    if (!block) return;

    const blockTypeId = block.typeId;
    if (!isLockedStorageBlock(blockTypeId)) return;

    event.cancel = true;
    player.sendMessage(MESSAGE_STORAGE_LOCKED_DURING_OBJECTIVE);
};
