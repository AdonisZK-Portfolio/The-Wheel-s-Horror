import { world } from "@minecraft/server";
import type { ScriptEventHandlerContext } from "../scriptEventHandlerTypes";
import { activeObjectives } from "../../state/activeObjectives";
import { beginnerObjectiveActivePlayerIds } from "../../state/beginnerObjectiveActivePlayerIds";
import { beginnerObjectiveCountByPlayerId } from "../../state/beginnerObjectiveCountByPlayerId";
import { anomalyCooldownClearObjectiveStartTickByPlayerId } from "../../state/anomalyCooldownClearObjectiveStartTickByPlayerId";
import { anomalyEventActiveUntilTickByPlayerId } from "../../state/anomalyEventActiveUntilTickByPlayerId";
import { anomalyEventFakeJoinLeaveTriggeredPlayerIds } from "../../state/anomalyEventFakeJoinLeaveTriggeredPlayerIds";
import { anomalyEventNextAllowedTickByPlayerId } from "../../state/anomalyEventNextAllowedTickByPlayerId";
import { anomalyEventTunnelChunkTrackingInitializedPlayerIds } from "../../state/anomalyEventTunnelChunkTrackingInitializedPlayerIds";
import { anomalyEventTunnelCoordinateRequestedPlayerIds } from "../../state/anomalyEventTunnelCoordinateRequestedPlayerIds";
import { anomalyEventTunnelNewlyLoadedChunkKeysByPlayerId } from "../../state/anomalyEventTunnelNewlyLoadedChunkKeysByPlayerId";
import { anomalyEventTunnelSearchUntilTickByPlayerId } from "../../state/anomalyEventTunnelSearchUntilTickByPlayerId";
import { anomalyEventTunnelSeenChunkKeysByPlayerId } from "../../state/anomalyEventTunnelSeenChunkKeysByPlayerId";
import { anomalyEventTunnelTriggeredPlayerIds } from "../../state/anomalyEventTunnelTriggeredPlayerIds";
import { creatureSpawnNextAllowedTickByPlayerId } from "../../state/creatureSpawnNextAllowedTickByPlayerId";
import { nextTriggerTickByPlayer } from "../../state/nextTriggerTickByPlayer";
import { playerProgressionById } from "../../state/playerProgressionById";
import { playtestDevStatusTrackedPlayerIds } from "../../state/playtestDevStatusTrackedPlayerIds";
import { searchSequenceUnderwaterStartTickByPlayerId } from "../../state/searchSequenceUnderwaterStartTickByPlayerId";
import { stopSearchSequenceForPlayer } from "../../objective/chase/stopSearchSequenceForPlayer";
import { clearPlaytestDevStatusScoreboard } from "../../ui/playtest/updatePlaytestDevStatusScoreboardForPlayer";
import { getPlayerStatePropertyKey } from "../../utils/playerState/getPlayerStatePropertyKey";
import { MESSAGE_WHEEL_PLAYER_STATE_RESET_SELF } from "../../config/messages";

export const handleResetPlayerState = ({ player }: ScriptEventHandlerContext): void => {
    if (!player?.isValid) return;

    const playerId = player.id;

    activeObjectives.delete(playerId);
    beginnerObjectiveCountByPlayerId.delete(playerId);
    beginnerObjectiveActivePlayerIds.delete(playerId);
    nextTriggerTickByPlayer.delete(playerId);
    playerProgressionById.delete(playerId);

    anomalyEventActiveUntilTickByPlayerId.delete(playerId);
    anomalyEventNextAllowedTickByPlayerId.delete(playerId);
    anomalyCooldownClearObjectiveStartTickByPlayerId.delete(playerId);
    anomalyEventTunnelTriggeredPlayerIds.delete(playerId);
    anomalyEventTunnelSearchUntilTickByPlayerId.delete(playerId);
    anomalyEventTunnelCoordinateRequestedPlayerIds.delete(playerId);
    anomalyEventTunnelSeenChunkKeysByPlayerId.delete(playerId);
    anomalyEventTunnelNewlyLoadedChunkKeysByPlayerId.delete(playerId);
    anomalyEventTunnelChunkTrackingInitializedPlayerIds.delete(playerId);
    anomalyEventFakeJoinLeaveTriggeredPlayerIds.delete(playerId);

    if (playtestDevStatusTrackedPlayerIds.has(playerId)) {
        playtestDevStatusTrackedPlayerIds.delete(playerId);
        clearPlaytestDevStatusScoreboard();
    }

    searchSequenceUnderwaterStartTickByPlayerId.delete(playerId);
    creatureSpawnNextAllowedTickByPlayerId.delete(playerId);
    stopSearchSequenceForPlayer(playerId);

    world.setDynamicProperty(getPlayerStatePropertyKey(player.name), undefined);

    player.sendMessage(MESSAGE_WHEEL_PLAYER_STATE_RESET_SELF);
};
