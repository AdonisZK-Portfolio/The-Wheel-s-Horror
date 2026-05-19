import type { ScriptEventHandlerContext } from "../scriptEventHandlerTypes";
import { activeObjectives } from "../../state/activeObjectives";
import { getObjectiveForTier } from "../../objective/getObjectiveForTier";
import { startObjectiveWithDefinition } from "../../objective/startObjectiveWithDefinition";
import type { ObjectiveAmountTier } from "../../utils/types/ObjectiveDefinition";
import {
    MESSAGE_WHEEL_OBJECTIVE_FORCED_SELF,
    MESSAGE_WHEEL_START_OBJECTIVE_INVALID_TIER,
    MESSAGE_WHEEL_START_OBJECTIVE_NO_ELIGIBLE_SELF
} from "../../config/messages";

const VALID_TIERS: readonly ObjectiveAmountTier[] = ["easy", "medium", "hard", "very_hard"];

export const handleStartObjective = ({ player, message }: ScriptEventHandlerContext): void => {
    if (!player?.isValid) return;

    const tier = message as ObjectiveAmountTier;
    if (!VALID_TIERS.includes(tier)) {
        player.sendMessage(MESSAGE_WHEEL_START_OBJECTIVE_INVALID_TIER);
        return;
    }

    const objective = getObjectiveForTier(player.id, tier);
    if (!objective) {
        player.sendMessage(MESSAGE_WHEEL_START_OBJECTIVE_NO_ELIGIBLE_SELF);
        return;
    }

    activeObjectives.delete(player.id);
    startObjectiveWithDefinition(player, objective);
    player.sendMessage(MESSAGE_WHEEL_OBJECTIVE_FORCED_SELF);
};
