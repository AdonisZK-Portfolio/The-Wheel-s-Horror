import { anomalyEventFakeJoinLeaveTriggeredPlayerIds } from "../../state/anomalyEventFakeJoinLeaveTriggeredPlayerIds";

export const resetEchoOneTimeForPlaytest = (playerId: string): void => {
    anomalyEventFakeJoinLeaveTriggeredPlayerIds.delete(playerId);
};
