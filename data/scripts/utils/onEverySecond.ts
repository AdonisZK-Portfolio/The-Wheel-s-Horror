import { system } from "@minecraft/server";
import { TICKS_PER_SECOND } from "../config/constants";

export const OnEverySecond = (callback: () => void): void => {
    system.runInterval(callback, TICKS_PER_SECOND);
};
