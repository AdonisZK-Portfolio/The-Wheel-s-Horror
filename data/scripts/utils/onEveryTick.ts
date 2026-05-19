import { system } from "@minecraft/server";

export const OnEveryTick = (callback: () => void): void => {
    system.runInterval(callback, 1);
};