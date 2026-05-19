import type { ScriptEventHandlerContext } from "../scriptEventHandlerTypes";
import { getPlaytestStatusMessageForPlayer } from "../../ui/playtest/getPlaytestStatusMessageForPlayer";
import { MESSAGE_WHEEL_PLAYTEST_STATUS_SHOWN_SELF } from "../../config/messages";

export const handlePlaytestStatus = ({ player }: ScriptEventHandlerContext): void => {
    if (!player?.isValid) return;
    player.sendMessage(getPlaytestStatusMessageForPlayer(player));
    player.sendMessage(MESSAGE_WHEEL_PLAYTEST_STATUS_SHOWN_SELF);
};
