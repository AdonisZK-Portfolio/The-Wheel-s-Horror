import { anomalyEventTunnelChunkTrackingInitializedPlayerIds } from "../../state/anomalyEventTunnelChunkTrackingInitializedPlayerIds";
import { anomalyEventTunnelCoordinateRequestedPlayerIds } from "../../state/anomalyEventTunnelCoordinateRequestedPlayerIds";
import { anomalyEventTunnelNewlyLoadedChunkKeysByPlayerId } from "../../state/anomalyEventTunnelNewlyLoadedChunkKeysByPlayerId";
import { anomalyEventTunnelSearchUntilTickByPlayerId } from "../../state/anomalyEventTunnelSearchUntilTickByPlayerId";
import { anomalyEventTunnelSeenChunkKeysByPlayerId } from "../../state/anomalyEventTunnelSeenChunkKeysByPlayerId";
import { anomalyEventTunnelTriggeredPlayerIds } from "../../state/anomalyEventTunnelTriggeredPlayerIds";

export const resetTunnelOneTimeForPlaytest = (playerId: string): void => {
    anomalyEventTunnelTriggeredPlayerIds.delete(playerId);
    anomalyEventTunnelSearchUntilTickByPlayerId.delete(playerId);
    anomalyEventTunnelCoordinateRequestedPlayerIds.delete(playerId);
    anomalyEventTunnelSeenChunkKeysByPlayerId.delete(playerId);
    anomalyEventTunnelNewlyLoadedChunkKeysByPlayerId.delete(playerId);
    anomalyEventTunnelChunkTrackingInitializedPlayerIds.delete(playerId);
};
