import {
    system,
    world
} from "@minecraft/server";
import { OnEverySecond } from "./utils/onEverySecond.ts";
import { OnEveryTick } from "./utils/onEveryTick.ts";
import { onEntityDie } from "./events/onEntityDie";
import { onPlayerBreakBlock } from "./events/onPlayerBreakBlock";
import { onPlayerInteractWithBlock } from "./events/onPlayerInteractWithBlock";
import { onPlayerLeave } from "./events/onPlayerLeave";
import { onPlayerPlaceBlock } from "./events/onPlayerPlaceBlock";
import { onPlayerSpawn } from "./events/onPlayerSpawn";
import { onPlayerUseItem } from "./events/onPlayerUseItem.ts";
import { onScriptEventReceive } from "./events/onScriptEventReceive";
import { runObjectiveTick } from "./objective/runObjectiveTick";
import { runSearchSequenceTick } from "./objective/chase/runSearchSequenceTick";
import { runStalkerSteveTick } from "./creature/stalkerSteve/runStalkerSteveTick";

world.afterEvents.entityDie.subscribe(onEntityDie);
world.afterEvents.playerSpawn.subscribe(onPlayerSpawn);
world.afterEvents.itemUse.subscribe(onPlayerUseItem);
world.beforeEvents.playerLeave.subscribe(onPlayerLeave);
world.beforeEvents.playerBreakBlock.subscribe(onPlayerBreakBlock);
world.beforeEvents.playerInteractWithBlock.subscribe(onPlayerInteractWithBlock);
world.afterEvents.playerPlaceBlock.subscribe(onPlayerPlaceBlock);
system.afterEvents.scriptEventReceive.subscribe(onScriptEventReceive);
OnEveryTick(runSearchSequenceTick);
OnEveryTick(runStalkerSteveTick);
OnEverySecond(runObjectiveTick);
