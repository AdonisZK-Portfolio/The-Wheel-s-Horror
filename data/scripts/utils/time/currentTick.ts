import { system } from "@minecraft/server";

export const currentTick = (): number => {
    return system.currentTick;
};
