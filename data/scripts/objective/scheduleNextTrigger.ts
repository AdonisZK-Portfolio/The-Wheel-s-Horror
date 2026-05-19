import { TRIGGER_CHECK_INTERVAL_SECONDS, TICKS_PER_SECOND } from "../config/constants";
import { nextTriggerTickByPlayer } from "../state/nextTriggerTickByPlayer";

export const scheduleNextTrigger = (
    playerId: string,
    fromTick: number,
    minimumTriggerTick?: number
): void => {
    const intervalTick = fromTick + TRIGGER_CHECK_INTERVAL_SECONDS * TICKS_PER_SECOND;
    const nextTriggerTick = minimumTriggerTick === undefined
        ? intervalTick
        : Math.max(intervalTick, minimumTriggerTick);

    nextTriggerTickByPlayer.set(playerId, nextTriggerTick);
};
