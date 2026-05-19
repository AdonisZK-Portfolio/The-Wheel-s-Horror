import {
    DAY_TRIGGER_DENOMINATOR,
    NIGHT_TRIGGER_DENOMINATOR
} from "../config/constants";
import { isNightTime } from "../utils/time/isNightTime";
import { randomInt } from "../utils/randomInt";

const rollChance = (denominator: number): boolean => {
    return randomInt(1, denominator) === 1;
};

export const shouldStartObjectiveNow = (): boolean => {
    if (isNightTime()) {
        return rollChance(NIGHT_TRIGGER_DENOMINATOR);
    }

    return rollChance(DAY_TRIGGER_DENOMINATOR);
};
