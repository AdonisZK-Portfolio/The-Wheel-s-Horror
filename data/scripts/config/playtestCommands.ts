import {
    SCRIPT_EVENT_WHEEL_FORCE_FAIL,
    SCRIPT_EVENT_WHEEL_FORCE_SUCCESS,
    SCRIPT_EVENT_WHEEL_FORCE_ANOMALY,
    SCRIPT_EVENT_WHEEL_ANOMALY,
    SCRIPT_EVENT_WHEEL_ANOMALY_DOOR,
    SCRIPT_EVENT_WHEEL_ANOMALY_ECHO,
    SCRIPT_EVENT_WHEEL_ANOMALY_FOOTSTEP,
    SCRIPT_EVENT_WHEEL_ANOMALY_RESET_ONCE,
    SCRIPT_EVENT_WHEEL_ANOMALY_TORCH,
    SCRIPT_EVENT_WHEEL_ANOMALY_TREE,
    SCRIPT_EVENT_WHEEL_ANOMALY_TUNNEL,
    SCRIPT_EVENT_WHEEL_DEV_STATUS,
    SCRIPT_EVENT_WHEEL_GDD_STATUS,
    SCRIPT_EVENT_WHEEL_HELP,
    SCRIPT_EVENT_WHEEL_KILL_WHEEL,
    SCRIPT_EVENT_WHEEL_PRINT_OBJECTIVE_POOL,
    SCRIPT_EVENT_WHEEL_REROLL,
    SCRIPT_EVENT_WHEEL_RESET_PLAYER_STATE,
    SCRIPT_EVENT_WHEEL_SKIP_GRACE,
    SCRIPT_EVENT_WHEEL_START_BEGINNER_OBJECTIVE,
    SCRIPT_EVENT_WHEEL_START_OBJECTIVE,
    SCRIPT_EVENT_WHEEL_UNLOCK_PROGRESSION,
    SCRIPT_EVENT_WHEEL_STATUS,
    SCRIPT_EVENT_WHEEL_TEST,
    SCRIPT_EVENT_WHEEL_TEST_ALL,
    SCRIPT_EVENT_STALKER_STEVE_SPAWN,
    SCRIPT_EVENT_STALKER_STEVE_KILL
} from "./scriptEvents";

const buildCommand = (eventId: string): string => {
    return `/scriptevent ${eventId}`;
};

export const PLAYTEST_COMMAND_LINES: readonly string[] = [
    "[Wheel] Playtest Commands",
    `${buildCommand(SCRIPT_EVENT_WHEEL_TEST)} - Start random objective for self`,
    `${buildCommand(SCRIPT_EVENT_WHEEL_TEST_ALL)} - Start objective for all players`,
    `${buildCommand(SCRIPT_EVENT_WHEEL_START_BEGINNER_OBJECTIVE)} - Start beginner objective for self`,
    `${buildCommand(SCRIPT_EVENT_WHEEL_START_OBJECTIVE)} <easy|medium|hard|very_hard> - Start forced tier objective for self`,
    `${buildCommand(SCRIPT_EVENT_WHEEL_UNLOCK_PROGRESSION)} <nether|jungle|iron_age|deep_cave|diamond_age|end|silk_touch|enchanting> - Unlock progression key for self`,
    `${buildCommand(SCRIPT_EVENT_WHEEL_FORCE_SUCCESS)} - End objective as success for self`,
    `${buildCommand(SCRIPT_EVENT_WHEEL_FORCE_FAIL)} - End objective as failure for self`,
    `${buildCommand(SCRIPT_EVENT_WHEEL_FORCE_ANOMALY)} <tree|tunnel|footstep|door|torch|echo> - Trigger named anomaly for self`,
    `${buildCommand(SCRIPT_EVENT_WHEEL_ANOMALY)} - Trigger tree mutation anomaly (legacy alias)`,
    `${buildCommand(SCRIPT_EVENT_WHEEL_ANOMALY_TREE)} - Trigger tree mutation anomaly`,
    `${buildCommand(SCRIPT_EVENT_WHEEL_ANOMALY_TUNNEL)} - Trigger hill tunnel anomaly`,
    `${buildCommand(SCRIPT_EVENT_WHEEL_ANOMALY_FOOTSTEP)} - Trigger footstep illusion anomaly`,
    `${buildCommand(SCRIPT_EVENT_WHEEL_ANOMALY_DOOR)} - Trigger door memory glitch anomaly`,
    `${buildCommand(SCRIPT_EVENT_WHEEL_ANOMALY_TORCH)} - Trigger random torch removal anomaly`,
    `${buildCommand(SCRIPT_EVENT_WHEEL_ANOMALY_ECHO)} - Trigger fake leave echo anomaly`,
    `${buildCommand(SCRIPT_EVENT_WHEEL_ANOMALY_RESET_ONCE)} - Reset one-time anomaly limits for self`,
    `${buildCommand(SCRIPT_EVENT_WHEEL_REROLL)} - Reroll current objective for self`,
    `${buildCommand(SCRIPT_EVENT_WHEEL_SKIP_GRACE)} - Skip grace cooldown for self`,
    `${buildCommand(SCRIPT_EVENT_WHEEL_KILL_WHEEL)} - Stop chase and despawn wheel for self (playtest only)`,
    `${buildCommand(SCRIPT_EVENT_WHEEL_RESET_PLAYER_STATE)} - Reset all player state for self (playtest only)`,
    `${buildCommand(SCRIPT_EVENT_STALKER_STEVE_SPAWN)} - Spawn Stalker Steve near self`,
    `${buildCommand(SCRIPT_EVENT_STALKER_STEVE_KILL)} - Kill all Stalker Steve entities within 64 blocks of self`,
    `${buildCommand(SCRIPT_EVENT_WHEEL_PRINT_OBJECTIVE_POOL)} - Show eligible objective pool counts by tier for self`,
    `${buildCommand(SCRIPT_EVENT_WHEEL_GDD_STATUS)} - Show GDD state overview for self`,
    `${buildCommand(SCRIPT_EVENT_WHEEL_STATUS)} - Show objective, timer, and reroll status for self`,
    `${buildCommand(SCRIPT_EVENT_WHEEL_DEV_STATUS)} - Toggle live hidden internals on scoreboard`,
    `${buildCommand(SCRIPT_EVENT_WHEEL_HELP)} - Show this command list`
];

export const getPlaytestCommandsMessage = (): string => {
    return PLAYTEST_COMMAND_LINES.join("\n");
};
