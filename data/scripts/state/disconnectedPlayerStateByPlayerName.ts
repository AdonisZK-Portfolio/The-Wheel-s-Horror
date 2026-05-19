import type { ActiveObjective } from "../utils/types/ActiveObjective";
import type { PlayerProgressionState } from "../utils/types/PlayerProgressionState";

export interface DisconnectedPlayerState {
    readonly activeObjective?: ActiveObjective;
    readonly nextTriggerTick?: number;
    readonly progression?: PlayerProgressionState;
    readonly anomalyActiveUntilTick?: number;
    readonly anomalyNextAllowedTick?: number;
    readonly devStatusTracked?: boolean;
}

export const disconnectedPlayerStateByPlayerName = new Map<string, DisconnectedPlayerState>();
