import type { PlayerPlaceBlockAfterEvent } from "@minecraft/server";
import { playerPlacedOakLogLocationKeys } from "../state/playerPlacedOakLogLocationKeys";
import { getBlockLocationKey } from "./getBlockLocationKey";
import { isAnomalyAffectedLogTypeId } from "./isAnomalyAffectedLogTypeId";

export const trackPlacedOakLog = (event: PlayerPlaceBlockAfterEvent): void => {
    const block = event.block;
    if (!block) return;
    if (!isAnomalyAffectedLogTypeId(block.typeId)) return;

    const key = getBlockLocationKey(block.dimension.id, block.location);
    playerPlacedOakLogLocationKeys.add(key);
};
