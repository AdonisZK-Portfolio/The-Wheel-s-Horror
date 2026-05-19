import type { PlayerPlaceBlockAfterEvent } from "@minecraft/server";
import { trackPlacedOakLog } from "../anomaly/trackPlacedOakLog";
import { trackSearchSequencePlacedBlock } from "../objective/chase/trackSearchSequencePlacedBlock";

export const onPlayerPlaceBlock = (event: PlayerPlaceBlockAfterEvent): void => {
    const player = event.player;
    if (!player?.isValid) return;

    trackSearchSequencePlacedBlock(player, event.block);
    trackPlacedOakLog(event);
};
