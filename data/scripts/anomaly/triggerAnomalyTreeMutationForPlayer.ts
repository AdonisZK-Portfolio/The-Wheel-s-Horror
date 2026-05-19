import type { Player } from "@minecraft/server";
import { collectSecondFromBottomTreeLogLocations } from "./collectSecondFromBottomTreeLogLocations";
import { isAnomalyAffectedLogTypeId } from "./isAnomalyAffectedLogTypeId";

export const triggerAnomalyTreeMutationForPlayer = (player: Player): boolean => {
    const secondFromBottomLogs = collectSecondFromBottomTreeLogLocations(player);
    if (secondFromBottomLogs.length === 0) return false;

    let hasMutatedAny = false;
    for (const location of secondFromBottomLogs) {
        const targetLog = player.dimension.getBlock(location);
        if (!targetLog) continue;
        if (!isAnomalyAffectedLogTypeId(targetLog.typeId)) continue;

        targetLog.setType("minecraft:air");
        hasMutatedAny = true;
    }

    return hasMutatedAny;
};
