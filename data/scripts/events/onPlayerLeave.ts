import type { PlayerLeaveBeforeEvent } from "@minecraft/server";
import { snapshotPlayerStateOnLeave } from "./snapshotPlayerStateOnLeave";

export const onPlayerLeave = (event: PlayerLeaveBeforeEvent): void => {
    snapshotPlayerStateOnLeave(event.player);
};
