import type { ScriptEventCommandMessageAfterEvent } from "@minecraft/server";
import { getSourcePlayer } from "./getSourcePlayer";
import { buildScriptEventHandlerMap } from "./buildScriptEventHandlerMap";

const scriptEventHandlerMap = buildScriptEventHandlerMap();

export const onScriptEventReceive = (event: ScriptEventCommandMessageAfterEvent): void => {
    const eventId = event.id.toLowerCase();
    const player = getSourcePlayer(event);
    const handler = scriptEventHandlerMap.get(eventId);
    if (!handler) return;
    handler({ player, message: event.message });
};
