import { world } from "@minecraft/server";

export const isNightTime = (): boolean => {
    const timeOfDay = world.getTimeOfDay();
    return timeOfDay >= 13000 && timeOfDay < 23000;
};
