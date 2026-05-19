import { world } from "@minecraft/server";
import { progressionUnlockChecks } from "../objective/progression/progressionUnlockChecks";
import { tryTriggerAnomalyEventForPlayer } from "../anomaly/tryTriggerAnomalyEventForPlayer";
import { trySpawnCreatureForPlayer } from "../creature/trySpawnCreatureForPlayer";
import { tickPlayerObjective } from "../objective/tickPlayerObjective";
import { updatePlaytestDevStatusScoreboardForPlayer } from "../ui/playtest/updatePlaytestDevStatusScoreboardForPlayer";
import { savePlayerStateSnapshot } from "../events/snapshotPlayerStateOnLeave";
import { playtestDevStatusTrackedPlayerIds } from "../state/playtestDevStatusTrackedPlayerIds";

export const runObjectiveTick = (): void => {
    const players = world.getAllPlayers();
    for (const player of players) {
        for (const check of progressionUnlockChecks) {
            check(player);
        }
        tickPlayerObjective(player);
        tryTriggerAnomalyEventForPlayer(player);
        trySpawnCreatureForPlayer(player);
        if (playtestDevStatusTrackedPlayerIds.has(player.id)) {
            updatePlaytestDevStatusScoreboardForPlayer(player);
        }
        savePlayerStateSnapshot(player);
    }
};
