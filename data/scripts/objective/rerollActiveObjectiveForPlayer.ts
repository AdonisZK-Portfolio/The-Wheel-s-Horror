import {
    Player,
    system
} from "@minecraft/server";
import {
    REROLL_OBJECTIVE_REVEAL_DELAY_SECONDS,
    REROLL_LOCK_SECONDS,
    TICKS_PER_SECOND
} from "../config/constants";
import { getRequiredObjectiveAmount } from "../objective/getRequiredObjectiveAmount";
import { activeObjectives } from "../state/activeObjectives";
import { beginnerObjectiveActivePlayerIds } from "../state/beginnerObjectiveActivePlayerIds";
import { currentTick } from "../utils/time/currentTick";
import type { ActiveObjective } from "../utils/types/ActiveObjective";
import { consumeRerollItemFromPlayer } from "../objective/reroll/consumeRerollItemFromPlayer";
import { getRerollItemCount } from "../objective/reroll/getRerollItemCount";
import type { RerollAttemptResult } from "../objective/reroll/RerollAttemptResult";
import { showObjectiveReveal } from "../ui/showObjectiveReveal";
import { showRerollSpinCinematic } from "../ui/showRerollSpinCinematic";
import { getObjectiveForTier } from "./getObjectiveForTier";
import { getObjectiveDurationSeconds } from "./getObjectiveDurationSeconds";
import { getRandomObjective } from "./getRandomObjective";

export const rerollActiveObjectiveForPlayer = (player: Player): RerollAttemptResult => {
    if (!player.isValid) {
        return {
            ok: false,
            reason: "no_active_objective"
        };
    }

    const playerId = player.id;
    const activeObjective = activeObjectives.get(playerId);
    if (!activeObjective) {
        return {
            ok: false,
            reason: "no_active_objective"
        };
    }

    const nowTick = currentTick();
    if (nowTick - activeObjective.startedTick >= REROLL_LOCK_SECONDS * TICKS_PER_SECOND) {
        return {
            ok: false,
            reason: "locked"
        };
    }

    if (getRerollItemCount(player) <= 0) {
        return {
            ok: false,
            reason: "no_token"
        };
    }

    if (!consumeRerollItemFromPlayer(player)) {
        return {
            ok: false,
            reason: "no_token"
        };
    }

    const objective = beginnerObjectiveActivePlayerIds.has(playerId)
        ? getObjectiveForTier(playerId, "easy") ?? getRandomObjective(playerId)
        : getRandomObjective(playerId);
    const requiredAmount = getRequiredObjectiveAmount(objective);
    const objectiveDurationSeconds = getObjectiveDurationSeconds(objective.amountTier);
    const nextObjective: ActiveObjective = {
        objective,
        requiredAmount,
        startedTick: activeObjective.startedTick,
        deadlineTick: activeObjective.startedTick + objectiveDurationSeconds * TICKS_PER_SECOND,
        revealTick: nowTick + REROLL_OBJECTIVE_REVEAL_DELAY_SECONDS * TICKS_PER_SECOND
    };

    activeObjectives.set(playerId, nextObjective);
    showRerollSpinCinematic(player);

    system.runTimeout((): void => {
        if (!player.isValid) return;

        const latestObjective = activeObjectives.get(playerId);
        if (latestObjective !== nextObjective) return;

        showObjectiveReveal(player, objective.displayName, requiredAmount);
    }, REROLL_OBJECTIVE_REVEAL_DELAY_SECONDS * TICKS_PER_SECOND);

    return {
        ok: true
    };
};
