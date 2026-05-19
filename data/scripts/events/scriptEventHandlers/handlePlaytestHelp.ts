import type { ScriptEventHandlerContext } from "../scriptEventHandlerTypes";
import { getPlaytestCommandsMessage } from "../../config/playtestCommands";
import { MESSAGE_WHEEL_PLAYTEST_COMMANDS_SHOWN_SELF } from "../../config/messages";

export const handlePlaytestHelp = ({ player }: ScriptEventHandlerContext): void => {
    if (!player?.isValid) return;
    player.sendMessage(getPlaytestCommandsMessage());
    player.sendMessage(MESSAGE_WHEEL_PLAYTEST_COMMANDS_SHOWN_SELF);
};
