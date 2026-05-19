import { Player, system } from "@minecraft/server";
import { OBJECTIVE_REVEAL_DELAY_SECONDS, TICKS_PER_SECOND } from "../config/constants";
import { activeObjectives } from "../state/activeObjectives";
import { currentTick } from "../utils/time/currentTick";
import type { ActiveObjective } from "../utils/types/ActiveObjective";
import type { ObjectiveDefinition } from "../utils/types/ObjectiveDefinition";
import { getRequiredObjectiveAmount } from "./getRequiredObjectiveAmount";
import { grantRerollTokenForObjectiveStart } from "./reroll/grantRerollTokenForObjectiveStart";
import { showObjectiveReveal } from "../ui/showObjectiveReveal";
import { showObjectiveStartCinematic } from "../ui/showObjectiveStartCinematic";
import { getObjectiveDurationSeconds } from "./getObjectiveDurationSeconds";

export const startObjectiveWithDefinition = (player: Player, objective: ObjectiveDefinition): void => {
    if (!player.isValid) return;
    if (activeObjectives.has(player.id)) return;

    const requiredAmount = getRequiredObjectiveAmount(objective);
    const start = currentTick();
    const objectiveDurationSeconds = getObjectiveDurationSeconds(objective.amountTier);
    const activeObjective: ActiveObjective = {
        objective,
        requiredAmount,
        startedTick: start,
        deadlineTick: start + objectiveDurationSeconds * TICKS_PER_SECOND,
        revealTick: start + OBJECTIVE_REVEAL_DELAY_SECONDS * TICKS_PER_SECOND
    };

    activeObjectives.set(player.id, activeObjective);
    grantRerollTokenForObjectiveStart(player);
    showObjectiveStartCinematic(player);

    system.runTimeout((): void => {
        if (!player.isValid) return;

        const latestObjective = activeObjectives.get(player.id);
        if (latestObjective !== activeObjective) return;

        showObjectiveReveal(player, objective.displayName, requiredAmount);
    }, OBJECTIVE_REVEAL_DELAY_SECONDS * TICKS_PER_SECOND);
};
