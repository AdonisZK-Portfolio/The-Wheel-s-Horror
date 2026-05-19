import type { ScriptEventHandlerContext } from "../scriptEventHandlerTypes";
import { spawnStalkerSteveNearPlayer } from "../../creature/stalkerSteve/spawnStalkerSteveNearPlayer";
import { MESSAGE_STALKER_STEVE_SPAWNED_SELF } from "../../config/messages";

export const handleSpawnStalkerSteve = ({ player }: ScriptEventHandlerContext): void => {
    if (!player?.isValid) return;
    spawnStalkerSteveNearPlayer(player);
    player.sendMessage(MESSAGE_STALKER_STEVE_SPAWNED_SELF);
};
