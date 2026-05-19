import type { Player } from "@minecraft/server";

export interface ScriptEventHandlerContext {
    readonly player: Player | undefined;
    readonly message: string;
}

export type ScriptEventHandler = (context: ScriptEventHandlerContext) => void;
