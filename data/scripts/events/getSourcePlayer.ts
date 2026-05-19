import { Player } from "@minecraft/server";
import type { ScriptEventCommandMessageAfterEvent } from "@minecraft/server";

export const getSourcePlayer = (event: ScriptEventCommandMessageAfterEvent): Player | undefined => {
    const sourceEntity = event.sourceEntity;
    if (!sourceEntity) return undefined;
    if (!(sourceEntity instanceof Player)) return undefined;
    return sourceEntity;
};
