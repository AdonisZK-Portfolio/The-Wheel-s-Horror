export const MESSAGE_WHEEL_OBJECTIVE_FORCED_SELF = "[Wheel] Playtest objective forced for you.";
export const MESSAGE_WHEEL_OBJECTIVE_FORCED_ALL = "[Wheel] Playtest objective forced for all players.";
export const MESSAGE_WHEEL_OBJECTIVE_SUCCESS_FORCED_SELF = "[Wheel] Playtest objective marked as success for you.";
export const MESSAGE_WHEEL_OBJECTIVE_FAIL_FORCED_SELF = "[Wheel] Playtest objective marked as failure for you.";
export const MESSAGE_WHEEL_ANOMALY_FORCED_SELF = "[Wheel] Playtest anomaly event triggered for you.";
export const MESSAGE_WHEEL_ANOMALY_TREE_FORCED_SELF = "[Wheel] Playtest anomaly tree mutation triggered for you.";
export const MESSAGE_WHEEL_ANOMALY_TUNNEL_FORCED_SELF = "[Wheel] Playtest anomaly hill tunnel triggered for you.";
export const MESSAGE_WHEEL_ANOMALY_TUNNEL_SEARCH_TIMEOUT_SELF = "[Wheel] Tunnel anomaly search ended. Load new chunks and try again.";
export const MESSAGE_WHEEL_ANOMALY_FOOTSTEP_FORCED_SELF = "[Wheel] Playtest anomaly footstep illusion triggered for you.";
export const MESSAGE_WHEEL_ANOMALY_DOOR_FORCED_SELF = "[Wheel] Playtest anomaly door memory glitch triggered for you.";
export const MESSAGE_WHEEL_ANOMALY_TORCH_FORCED_SELF = "[Wheel] Playtest anomaly torch removal triggered for you.";
export const MESSAGE_WHEEL_ANOMALY_ECHO_FORCED_SELF = "[Wheel] Playtest anomaly fake leave echo triggered for you.";
export const MESSAGE_WHEEL_ANOMALY_ONE_TIME_RESET_SELF = "[Wheel] Playtest one-time anomaly limits reset for you.";
export const MESSAGE_WHEEL_ANOMALY_NOT_TRIGGERED_SELF = "[Wheel] Playtest anomaly had no valid target in range.";
export const MESSAGE_WHEEL_REROLL_TRIGGERED_SELF = "[Wheel] Playtest reroll triggered for you.";
export const MESSAGE_WHEEL_GRACE_SKIPPED_SELF = "[Wheel] Playtest grace skipped. Objective chance can roll now.";
export const MESSAGE_WHEEL_GRACE_SKIP_ACTIVE_OBJECTIVE_SELF = "[Wheel] Finish the active objective before skipping grace.";
export const MESSAGE_WHEEL_PLAYTEST_COMMANDS_SHOWN_SELF = "[Wheel] Playtest command list shown in chat.";
export const MESSAGE_WHEEL_PLAYTEST_STATUS_SHOWN_SELF = "[Wheel] Playtest status shown in chat.";
export const MESSAGE_WHEEL_PLAYTEST_DEV_STATUS_SHOWN_SELF = "[Wheel] Playtest dev status tracking enabled on scoreboard.";
export const MESSAGE_WHEEL_PLAYTEST_DEV_STATUS_HIDDEN_SELF = "[Wheel] Playtest dev status tracking disabled.";
export const MESSAGE_WHEEL_NO_ACTIVE_OBJECTIVE_SELF = "[Wheel] No active objective for this playtest command.";
export const MESSAGE_WHEEL_PLAYTEST_WHEEL_STOPPED_SELF = "[Wheel] Playtest wheel stopped and chase sequence cleared for you.";
export const MESSAGE_WHEEL_SEARCH_SEQUENCE_STARTED_SELF = "[Wheel] Failure registered. The search sequence has started.";
export const MESSAGE_STORAGE_LOCKED_DURING_OBJECTIVE = "[Wheel] Storage is locked during your active objective.";
export const MESSAGE_STORAGE_BREAK_LOCKED_DURING_OBJECTIVE = "[Wheel] You cannot break storage during your active objective.";
export const MESSAGE_BED_DESTROYED_DURING_OBJECTIVE = "[Wheel] The wheel rejects your sleep. Your bed is gone.";
export const MESSAGE_POOL_UNLOCKED_NETHER = "[Wheel] Objective pool unlocked: Nether.";
export const MESSAGE_POOL_UNLOCKED_JUNGLE = "[Wheel] Objective pool unlocked: Jungle.";
export const MESSAGE_POOL_UNLOCKED_IRON_AGE = "[Wheel] Objective pool unlocked: Iron Age.";
export const MESSAGE_POOL_UNLOCKED_DEEP_CAVE = "[Wheel] Objective pool unlocked: Deep Cave.";
export const MESSAGE_POOL_UNLOCKED_DIAMOND_AGE = "[Wheel] Objective pool unlocked: Diamond Age.";
export const MESSAGE_POOL_UNLOCKED_END = "[Wheel] Objective pool unlocked: End.";
export const MESSAGE_POOL_UNLOCKED_SILK_TOUCH = "[Wheel] Objective pool unlocked: Silk Touch.";
export const MESSAGE_POOL_UNLOCKED_ENCHANTING = "[Wheel] Objective pool unlocked: Enchanting.";
export const MESSAGE_WHEEL_INVALID_PROGRESSION_KEY = "[Wheel] Invalid progression key. Valid values: nether, jungle, iron_age, deep_cave, diamond_age, end, silk_touch, enchanting.";
export const MESSAGE_WHEEL_PROGRESSION_ALREADY_UNLOCKED = "[Wheel] Progression already unlocked: {DisplayName}.";
export const MESSAGE_GUIDEBOOK_GIVEN = "[Wheel] You received the Wheel Guidebook.";
export const MESSAGE_REROLL_NO_ACTIVE_OBJECTIVE = "[Wheel] You have no active objective to reroll.";
export const MESSAGE_REROLL_LOCKED = "[Wheel] Reroll lock is active after the first minute.";
export const MESSAGE_REROLL_EMPTY = "[Wheel] You have no reroll token.";
export const MESSAGE_STALKER_STEVE_SPAWNED_SELF = "[Wheel] Playtest Stalker Steve spawned near you.";
export const MESSAGE_STALKER_STEVE_KILLED_SELF = "[Wheel] Playtest Stalker Steve entities removed near you.";
export const MESSAGE_WHEEL_START_OBJECTIVE_INVALID_TIER = "[Wheel] Invalid tier. Valid values: easy, medium, hard, very_hard.";
export const MESSAGE_WHEEL_START_OBJECTIVE_NO_ELIGIBLE_SELF = "[Wheel] No eligible objective for that tier. Objectives may be blacklisted or require locked progression.";
export const MESSAGE_WHEEL_FORCE_ANOMALY_INVALID_TYPE = "[Wheel] Invalid anomaly type. Valid values: tree, tunnel, footstep, door, torch, echo.";
export const MESSAGE_WHEEL_PLAYER_STATE_RESET_SELF = "[Wheel] Playtest player state reset for you.";

export const formatDifficultySetMessage = (difficultyName: string): string => {
    return `[Wheel] Difficulty set to ${difficultyName}.`;
};

export const formatObjectiveStartMessage = (
    displayName: string,
    requiredAmount: number,
    durationSeconds: number
): string => {
    const durationMinutes = durationSeconds / 60;
    if (requiredAmount <= 1) {
        return `[Wheel] Objective: find ${displayName} in ${durationMinutes} minutes.`;
    }

    return `[Wheel] Objective: find ${requiredAmount} ${displayName} in ${durationMinutes} minutes.`;
};

export const formatObjectiveSuccessMessage = (displayName: string): string => {
    return `[Wheel] Success: ${displayName} found in time.`;
};

export const formatObjectiveFailureMessage = (displayName: string): string => {
    return `[Wheel] Failed: ${displayName} not found in time. Chase should start now.`;
};

export const formatRerollStatusMessage = (availableRerolls: number): string => {
    return `[Wheel] Objective rerolled. Rerolls left: ${availableRerolls}.`;
};

export const formatDoorAnomalyCoordinateMessage = (x: number, y: number, z: number): string => {
    return `[Wheel] Door anomaly location: ${x} ${y} ${z}.`;
};

export const formatTunnelAnomalyCoordinateMessage = (x: number, y: number, z: number): string => {
    return `[Wheel] Tunnel anomaly location: ${x} ${y} ${z}.`;
};

export const formatTunnelAnomalySearchStartedMessage = (durationSeconds: number): string => {
    return `[Wheel] Tunnel anomaly search started for ${durationSeconds} seconds.`;
};

export const formatObjectivePoolMessage = (
    playerName: string,
    easyCount: number,
    mediumCount: number,
    hardCount: number,
    veryHardCount: number,
    totalEligible: number,
    totalAll: number
): string => {
    return [
        `[Wheel] Objective Pool for ${playerName}`,
        `Easy: ${easyCount} eligible`,
        `Medium: ${mediumCount} eligible`,
        `Hard: ${hardCount} eligible`,
        `Very Hard: ${veryHardCount} eligible`,
        `Total: ${totalEligible} / ${totalAll}`
    ].join("\n");
};

export const formatGddStatusMessage = (
    playerName: string,
    difficulty: string,
    hasActiveObjective: boolean,
    activeObjectiveLabel: string | undefined,
    isChaseActive: boolean,
    isAnomalyActive: boolean,
    rerollCount: number,
    progressionKeys: readonly string[]
): string => {
    const objectiveText = hasActiveObjective
        ? `YES (${activeObjectiveLabel ?? "?"})`
        : "NO";
    const progressionText = progressionKeys.length > 0
        ? progressionKeys.join(", ")
        : "none";
    return [
        `[Wheel] GDD Status for ${playerName}`,
        `Difficulty: ${difficulty}`,
        `Active objective: ${objectiveText}`,
        `Chase active: ${isChaseActive ? "YES" : "NO"}`,
        `Anomaly active: ${isAnomalyActive ? "YES" : "NO"}`,
        `Reroll tokens: ${rerollCount}`,
        `Progression: ${progressionText}`
    ].join("\n");
};
