import type { ScriptEventHandlerContext } from "../scriptEventHandlerTypes";
import { handleStartObjective } from "./handleStartObjective";

export const handleStartBeginnerObjective = (context: ScriptEventHandlerContext): void => {
    handleStartObjective({ ...context, message: "easy" });
};
