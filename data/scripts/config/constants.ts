import type { ObjectiveAmountTier } from "../utils/types/ObjectiveDefinition";

export const TICKS_PER_SECOND = 20;
export const OBJECTIVE_DURATION_SECONDS_BY_TIER: Readonly<Record<ObjectiveAmountTier, number>> = {
    easy: 15 * 60,
    medium: 20 * 60,
    hard: 25 * 60,
    very_hard: 30 * 60
};
export const TRIGGER_CHECK_INTERVAL_SECONDS = 150;
export const DAY_TRIGGER_DENOMINATOR = 24;
export const NIGHT_TRIGGER_DENOMINATOR = 12;
export const REROLL_GRANT_PER_OBJECTIVE = 1;
export const REROLL_LOCK_SECONDS = 60;
export const OBJECTIVE_GRACE_PERIOD_SECONDS = 15 * 60;
export const OBJECTIVE_START_BLINDNESS_SECONDS = 4;
export const OBJECTIVE_REVEAL_DELAY_SECONDS = OBJECTIVE_START_BLINDNESS_SECONDS + 1;
export const OBJECTIVE_COUNTDOWN_ACTION_BAR_INTERVAL_TICKS = TICKS_PER_SECOND;
export const REROLL_SPIN_BLINDNESS_SECONDS = 6;
export const REROLL_OBJECTIVE_REVEAL_DELAY_SECONDS = REROLL_SPIN_BLINDNESS_SECONDS + 1;
export const ANOMALY_EVENT_TRIGGER_CHANCE_OUTSIDE_OBJECTIVE_PER_MINUTE = 0.02;
export const ANOMALY_EVENT_TRIGGER_CHANCE_OBJECTIVE_START_PER_MINUTE = 0.04;
export const ANOMALY_EVENT_TRIGGER_CHANCE_OBJECTIVE_END_PER_MINUTE = 0.12;
export const SEARCH_SEQUENCE_ANOMALY_TRIGGER_CHANCE_START_PER_MINUTE = 0.12;
export const SEARCH_SEQUENCE_ANOMALY_TRIGGER_CHANCE_END_PER_MINUTE = 0.2;
export const SEARCH_SEQUENCE_ANOMALY_TRIGGER_CHANCE_RAMP_SECONDS = 10 * 60;
export const ANOMALY_EVENT_COOLDOWN_SECONDS = 15 * 60;
export const ANOMALY_EVENT_SMALL_COOLDOWN_SECONDS = ANOMALY_EVENT_COOLDOWN_SECONDS / 2;
export const ANOMALY_EVENT_COOLDOWN_CLEAR_REMAINING_OBJECTIVE_SECONDS = 5 * 60;
export const ANOMALY_EVENT_ACTIVE_SECONDS = 30;
export const SEARCH_SEQUENCE_WHEEL_TYPE_ID = "twh:wheel";
export const SEARCH_SEQUENCE_WHEEL_NAME_TAG = "The Wheel";
export const SEARCH_SEQUENCE_WHEEL_ATTACK_RANGE = 2.4;
export const SEARCH_SEQUENCE_WHEEL_ATTACK_DAMAGE = 5;
export const SEARCH_SEQUENCE_WHEEL_ATTACK_COOLDOWN_TICKS = TICKS_PER_SECOND;
export const SEARCH_SEQUENCE_WHEEL_BREAK_BLOCKS_PER_TICK = 3;
export const SEARCH_SEQUENCE_WHEEL_TELEPORT_INTERVAL_TICKS = 10 * 20;
export const SEARCH_SEQUENCE_WHEEL_RECENT_BLOCK_MAX_AGE_SECONDS = 30;
export const ANOMALY_EVENT_SCAN_RADIUS = 10;
export const ANOMALY_EVENT_DISTANCE_FROM_PLAYER = 50;
export const ANOMALY_EVENT_MIN_DISTANCE_FROM_PLAYER = 10;
export const ANOMALY_EVENT_MAX_DISTANCE_FROM_PLAYER = 50;
export const ANOMALY_EVENT_DOOR_MAX_DISTANCE_FROM_PLAYER = 150;
export const ANOMALY_EVENT_TARGET_ATTEMPTS = 8;
export const ANOMALY_EVENT_TREE_LEAF_HORIZONTAL_RADIUS = 2;
export const ANOMALY_EVENT_TREE_LEAF_MIN_TOP_OFFSET = -4;
export const ANOMALY_EVENT_TREE_LEAF_MAX_TOP_OFFSET = 6;
export const ANOMALY_EVENT_HILL_TUNNEL_MIN_DISTANCE_FROM_PLAYER = 50;
export const ANOMALY_EVENT_HILL_TUNNEL_MAX_DISTANCE_FROM_PLAYER = 150;
export const ANOMALY_EVENT_HILL_TUNNEL_ATTEMPTS = 40;
export const ANOMALY_EVENT_HILL_TUNNEL_LENGTH = 4;
export const ANOMALY_EVENT_HILL_TUNNEL_MAX_Y_OFFSET = 16;
export const ANOMALY_EVENT_HILL_TUNNEL_MIN_Y_OFFSET = -8;
export const ANOMALY_EVENT_HILL_TUNNEL_NATURAL_TYPE_IDS: readonly string[] = [
    "minecraft:stone",
    "minecraft:granite",
    "minecraft:diorite",
    "minecraft:andesite",
    "minecraft:tuff",
    "minecraft:calcite",
    "minecraft:dripstone_block",
    "minecraft:deepslate",
    "minecraft:cobbled_deepslate",
    "minecraft:cobblestone",
    "minecraft:dirt",
    "minecraft:coarse_dirt",
    "minecraft:rooted_dirt",
    "minecraft:grass_block",
    "minecraft:podzol",
    "minecraft:mycelium",
    "minecraft:gravel",
    "minecraft:sand",
    "minecraft:red_sand",
    "minecraft:clay",
    "minecraft:mud",
    "minecraft:snow",
    "minecraft:snow_layer",
    "minecraft:netherrack",
    "minecraft:blackstone",
    "minecraft:basalt"
];
export const ANOMALY_EVENT_AFFECTED_LOG_TYPE_IDS: readonly string[] = [
    "minecraft:acacia_log",
    "minecraft:birch_log",
    "minecraft:cherry_log",
    "minecraft:dark_oak_log",
    "minecraft:jungle_log",
    "minecraft:mangrove_log",
    "minecraft:oak_log",
    "minecraft:spruce_log"
];
export const ANOMALY_EVENT_REQUIRED_LEAF_TYPE_IDS: readonly string[] = [
    "minecraft:acacia_leaves",
    "minecraft:azalea_leaves",
    "minecraft:birch_leaves",
    "minecraft:cherry_leaves",
    "minecraft:dark_oak_leaves",
    "minecraft:azalea_leaves_flowered",
    "minecraft:jungle_leaves",
    "minecraft:mangrove_leaves",
    "minecraft:oak_leaves",
    "minecraft:spruce_leaves"
];
export const ANOMALY_EVENT_WOODEN_DOOR_TYPE_IDS: readonly string[] = [
    "minecraft:wooden_door"
];
export const ANOMALY_EVENT_TORCH_TYPE_IDS: readonly string[] = [
    "minecraft:torch",
    "minecraft:soul_torch"
];
export const ANOMALY_EVENT_FOOTSTEP_DEFAULT_SOUND_ID = "step.gravel";
export const ANOMALY_EVENT_FOOTSTEP_MIN_DURATION_SECONDS = 1;
export const ANOMALY_EVENT_FOOTSTEP_MAX_DURATION_SECONDS = 3;
export const ANOMALY_EVENT_FOOTSTEP_INTERVAL_TICKS = 6;
export const ANOMALY_EVENT_FOOTSTEP_START_MIN_DISTANCE = 6;
export const ANOMALY_EVENT_FOOTSTEP_START_MAX_DISTANCE = 10;
export const ANOMALY_EVENT_FOOTSTEP_END_MIN_DISTANCE = 1;
export const ANOMALY_EVENT_FOOTSTEP_END_MAX_DISTANCE = 2;
export const STALKER_STEVE_TYPE_ID = "stalker:steve";
export const STALKER_STEVE_DISAPPEAR_CHANCE = 0.1;
export const CREATURE_SPAWN_CHANCE_QUEST_PHASE_1_PER_MINUTE = 0.10;
export const CREATURE_SPAWN_CHANCE_QUEST_PHASE_2_PER_MINUTE = 0.20;
export const CREATURE_SPAWN_CHANCE_QUEST_PHASE_3_PER_MINUTE = 0.30;
export const CREATURE_SPAWN_CHANCE_CHASE_PER_MINUTE = 0.40;
export const CREATURE_SPAWN_PHASE_2_START_SECONDS = 5 * 60;
export const CREATURE_SPAWN_PHASE_3_START_SECONDS = 10 * 60;
export const CREATURE_SPAWN_COOLDOWN_SECONDS = 3 * 60;
export const STALKER_STEVE_LOOK_FOV_DEGREES = 20;
export const STALKER_STEVE_LOOK_MAX_DISTANCE = 32;
export const STALKER_STEVE_FREEZE_EVENT = "stalker:freeze";
export const STALKER_STEVE_UNFREEZE_EVENT = "stalker:unfreeze";
export const STALKER_STEVE_SPAWN_DISTANCE = 12;
export const STALKER_STEVE_KILL_RADIUS = 64;
export const CHASE_CINEMATIC_REVEAL_TICKS = 30;
export const CHASE_CINEMATIC_CAMERA_RESTORE_TICKS = 40;
export const CHASE_CINEMATIC_WHEEL_SPAWN_DISTANCE = 8;
export const CHASE_CINEMATIC_FADE_IN_SECONDS = 0.5;
export const CHASE_CINEMATIC_HOLD_SECONDS = 0.5;
export const CHASE_CINEMATIC_FADE_OUT_SECONDS = 1.5;

export { OBJECTIVES } from "./objectives";
