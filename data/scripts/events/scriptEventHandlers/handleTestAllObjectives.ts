import { world } from "@minecraft/server";
import { triggerObjectiveForAllPlayers } from "../../objective/triggerObjectiveForAllPlayers";
import { MESSAGE_WHEEL_OBJECTIVE_FORCED_ALL } from "../../config/messages";

export const handleTestAllObjectives = (): void => {
    triggerObjectiveForAllPlayers();
    world.sendMessage(MESSAGE_WHEEL_OBJECTIVE_FORCED_ALL);
};
