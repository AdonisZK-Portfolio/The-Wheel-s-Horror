import type { ScriptEventHandlerContext } from "../scriptEventHandlerTypes";
import { killAllStalkerSteveNearPlayer } from "../../creature/stalkerSteve/killAllStalkerSteveNearPlayer";
import { MESSAGE_STALKER_STEVE_KILLED_SELF } from "../../config/messages";

export const handleKillStalkerSteve = ({ player }: ScriptEventHandlerContext): void => {
    if (!player?.isValid) return;
    killAllStalkerSteveNearPlayer(player);
    player.sendMessage(MESSAGE_STALKER_STEVE_KILLED_SELF);
};
