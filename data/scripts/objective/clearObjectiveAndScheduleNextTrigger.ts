import { activeObjectives } from "../state/activeObjectives";
import { scheduleNextTrigger } from "./scheduleNextTrigger";

export const clearObjectiveAndScheduleNextTrigger = (
    playerId: string,
    nowTick: number,
    minimumTriggerTick?: number
): void => {
    activeObjectives.delete(playerId);
    scheduleNextTrigger(playerId, nowTick, minimumTriggerTick);
};
