import {
    SCRIPT_EVENT_STALKER_STEVE_KILL,
    SCRIPT_EVENT_STALKER_STEVE_SPAWN,
    SCRIPT_EVENT_WHEEL_ANOMALY,
    SCRIPT_EVENT_WHEEL_ANOMALY_DOOR,
    SCRIPT_EVENT_WHEEL_ANOMALY_ECHO,
    SCRIPT_EVENT_WHEEL_ANOMALY_FOOTSTEP,
    SCRIPT_EVENT_WHEEL_ANOMALY_RESET_ONCE,
    SCRIPT_EVENT_WHEEL_ANOMALY_TORCH,
    SCRIPT_EVENT_WHEEL_ANOMALY_TREE,
    SCRIPT_EVENT_WHEEL_ANOMALY_TUNNEL,
    SCRIPT_EVENT_WHEEL_DEV_STATUS,
    SCRIPT_EVENT_WHEEL_FORCE_FAIL,
    SCRIPT_EVENT_WHEEL_FORCE_SUCCESS,
    SCRIPT_EVENT_WHEEL_FORCE_ANOMALY,
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
    SCRIPT_EVENT_WHEEL_TEST_ALL
} from "../config/scriptEvents";
import type { ScriptEventHandler } from "./scriptEventHandlerTypes";
import { handleDevStatus } from "./scriptEventHandlers/handleDevStatus";
import { handleForceDoorAnomaly } from "./scriptEventHandlers/handleForceDoorAnomaly";
import { handleForceEchoAnomaly } from "./scriptEventHandlers/handleForceEchoAnomaly";
import { handleForceFootstepAnomaly } from "./scriptEventHandlers/handleForceFootstepAnomaly";
import { handleForceObjectiveFail } from "./scriptEventHandlers/handleForceObjectiveFail";
import { handleForceObjectiveSuccess } from "./scriptEventHandlers/handleForceObjectiveSuccess";
import { handleForceTorchAnomaly } from "./scriptEventHandlers/handleForceTorchAnomaly";
import { handleForceTreeAnomaly } from "./scriptEventHandlers/handleForceTreeAnomaly";
import { handleForceTunnelAnomaly } from "./scriptEventHandlers/handleForceTunnelAnomaly";
import { handleKillStalkerSteve } from "./scriptEventHandlers/handleKillStalkerSteve";
import { handlePlaytestHelp } from "./scriptEventHandlers/handlePlaytestHelp";
import { handlePlaytestStatus } from "./scriptEventHandlers/handlePlaytestStatus";
import { handleRerollObjective } from "./scriptEventHandlers/handleRerollObjective";
import { handleResetOneTimeAnomalies } from "./scriptEventHandlers/handleResetOneTimeAnomalies";
import { handleSpawnStalkerSteve } from "./scriptEventHandlers/handleSpawnStalkerSteve";
import { handleStopWheelChase } from "./scriptEventHandlers/handleStopWheelChase";
import { handleForceAnomaly } from "./scriptEventHandlers/handleForceAnomaly";
import { handleGddStatus } from "./scriptEventHandlers/handleGddStatus";
import { handlePrintObjectivePool } from "./scriptEventHandlers/handlePrintObjectivePool";
import { handleResetPlayerState } from "./scriptEventHandlers/handleResetPlayerState";
import { handleSkipGrace } from "./scriptEventHandlers/handleSkipGrace";
import { handleStartBeginnerObjective } from "./scriptEventHandlers/handleStartBeginnerObjective";
import { handleStartObjective } from "./scriptEventHandlers/handleStartObjective";
import { handleTestAllObjectives } from "./scriptEventHandlers/handleTestAllObjectives";
import { handleTestObjective } from "./scriptEventHandlers/handleTestObjective";
import { handleUnlockProgression } from "./scriptEventHandlers/handleUnlockProgression";

export type { ScriptEventHandlerContext, ScriptEventHandler } from "./scriptEventHandlerTypes";

export const buildScriptEventHandlerMap = (): ReadonlyMap<string, ScriptEventHandler> => {
    const handlers = new Map<string, ScriptEventHandler>();

    handlers.set(SCRIPT_EVENT_WHEEL_TEST, handleTestObjective);
    handlers.set(SCRIPT_EVENT_WHEEL_TEST_ALL, handleTestAllObjectives);
    handlers.set(SCRIPT_EVENT_WHEEL_FORCE_SUCCESS, handleForceObjectiveSuccess);
    handlers.set(SCRIPT_EVENT_WHEEL_FORCE_FAIL, handleForceObjectiveFail);
    handlers.set(SCRIPT_EVENT_WHEEL_ANOMALY, handleForceTreeAnomaly);
    handlers.set(SCRIPT_EVENT_WHEEL_ANOMALY_TREE, handleForceTreeAnomaly);
    handlers.set(SCRIPT_EVENT_WHEEL_ANOMALY_TUNNEL, handleForceTunnelAnomaly);
    handlers.set(SCRIPT_EVENT_WHEEL_ANOMALY_FOOTSTEP, handleForceFootstepAnomaly);
    handlers.set(SCRIPT_EVENT_WHEEL_ANOMALY_DOOR, handleForceDoorAnomaly);
    handlers.set(SCRIPT_EVENT_WHEEL_ANOMALY_TORCH, handleForceTorchAnomaly);
    handlers.set(SCRIPT_EVENT_WHEEL_ANOMALY_ECHO, handleForceEchoAnomaly);
    handlers.set(SCRIPT_EVENT_WHEEL_ANOMALY_RESET_ONCE, handleResetOneTimeAnomalies);
    handlers.set(SCRIPT_EVENT_WHEEL_REROLL, handleRerollObjective);
    handlers.set(SCRIPT_EVENT_WHEEL_SKIP_GRACE, handleSkipGrace);
    handlers.set(SCRIPT_EVENT_WHEEL_STATUS, handlePlaytestStatus);
    handlers.set(SCRIPT_EVENT_WHEEL_DEV_STATUS, handleDevStatus);
    handlers.set(SCRIPT_EVENT_WHEEL_KILL_WHEEL, handleStopWheelChase);
    handlers.set(SCRIPT_EVENT_STALKER_STEVE_SPAWN, handleSpawnStalkerSteve);
    handlers.set(SCRIPT_EVENT_STALKER_STEVE_KILL, handleKillStalkerSteve);
    handlers.set(SCRIPT_EVENT_WHEEL_HELP, handlePlaytestHelp);
    handlers.set(SCRIPT_EVENT_WHEEL_START_BEGINNER_OBJECTIVE, handleStartBeginnerObjective);
    handlers.set(SCRIPT_EVENT_WHEEL_START_OBJECTIVE, handleStartObjective);
    handlers.set(SCRIPT_EVENT_WHEEL_UNLOCK_PROGRESSION, handleUnlockProgression);
    handlers.set(SCRIPT_EVENT_WHEEL_FORCE_ANOMALY, handleForceAnomaly);
    handlers.set(SCRIPT_EVENT_WHEEL_RESET_PLAYER_STATE, handleResetPlayerState);
    handlers.set(SCRIPT_EVENT_WHEEL_PRINT_OBJECTIVE_POOL, handlePrintObjectivePool);
    handlers.set(SCRIPT_EVENT_WHEEL_GDD_STATUS, handleGddStatus);

    return handlers;
};
