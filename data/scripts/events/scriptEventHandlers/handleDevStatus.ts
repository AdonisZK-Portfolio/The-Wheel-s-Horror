import type { ScriptEventHandlerContext } from "../scriptEventHandlerTypes";
import {
    clearPlaytestDevStatusScoreboard,
    updatePlaytestDevStatusScoreboardForPlayer
} from "../../ui/playtest/updatePlaytestDevStatusScoreboardForPlayer";
import {
    MESSAGE_WHEEL_PLAYTEST_DEV_STATUS_HIDDEN_SELF,
    MESSAGE_WHEEL_PLAYTEST_DEV_STATUS_SHOWN_SELF
} from "../../config/messages";
import { playtestDevStatusTrackedPlayerIds } from "../../state/playtestDevStatusTrackedPlayerIds";

export const handleDevStatus = ({ player }: ScriptEventHandlerContext): void => {
    if (!player?.isValid) return;
    if (playtestDevStatusTrackedPlayerIds.has(player.id)) {
        playtestDevStatusTrackedPlayerIds.clear();
        clearPlaytestDevStatusScoreboard();
        player.sendMessage(MESSAGE_WHEEL_PLAYTEST_DEV_STATUS_HIDDEN_SELF);
        return;
    }
    playtestDevStatusTrackedPlayerIds.clear();
    playtestDevStatusTrackedPlayerIds.add(player.id);
    updatePlaytestDevStatusScoreboardForPlayer(player);
    player.sendMessage(MESSAGE_WHEEL_PLAYTEST_DEV_STATUS_SHOWN_SELF);
};
