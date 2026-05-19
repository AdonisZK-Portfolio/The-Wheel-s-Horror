import { BlockVolume, type Player, type Vector3 } from "@minecraft/server";
import { ANOMALY_EVENT_AFFECTED_LOG_TYPE_IDS, ANOMALY_EVENT_REQUIRED_LEAF_TYPE_IDS, ANOMALY_EVENT_SCAN_RADIUS } from "../config/constants";
import { playerPlacedOakLogLocationKeys } from "../state/playerPlacedOakLogLocationKeys";
import { getBlockLocationKey } from "./getBlockLocationKey";
import { hasNearbyLeavesForTreeColumn } from "./hasNearbyLeavesForTreeColumn";

export const collectSecondFromBottomTreeLogLocationsInArea = (player: Player, center: Vector3): Vector3[] => {
    const min = {
        x: center.x - ANOMALY_EVENT_SCAN_RADIUS,
        y: -64,
        z: center.z - ANOMALY_EVENT_SCAN_RADIUS
    };
    const max = {
        x: center.x + ANOMALY_EVENT_SCAN_RADIUS,
        y: 320,
        z: center.z + ANOMALY_EVENT_SCAN_RADIUS
    };

    const treeLogs = player.dimension.getBlocks(
        new BlockVolume(min, max),
        { includeTypes: ANOMALY_EVENT_AFFECTED_LOG_TYPE_IDS },
        true
    );

    const treeLeaves = player.dimension.getBlocks(
        new BlockVolume(min, max),
        { includeTypes: ANOMALY_EVENT_REQUIRED_LEAF_TYPE_IDS },
        true
    );

    const yByColumn = new Map<string, number[]>();
    for (const location of treeLogs.getBlockLocationIterator()) {
        const key = getBlockLocationKey(player.dimension.id, location);
        if (playerPlacedOakLogLocationKeys.has(key)) continue;

        const columnKey = `${location.x},${location.z}`;
        const columnValues = yByColumn.get(columnKey);
        if (columnValues) {
            columnValues.push(location.y);
            continue;
        }

        yByColumn.set(columnKey, [location.y]);
    }

    const leafYByColumn = new Map<string, number[]>();
    for (const location of treeLeaves.getBlockLocationIterator()) {
        const columnKey = `${location.x},${location.z}`;
        const columnValues = leafYByColumn.get(columnKey);
        if (columnValues) {
            columnValues.push(location.y);
            continue;
        }

        leafYByColumn.set(columnKey, [location.y]);
    }

    const secondFromBottomLogs: Vector3[] = [];
    for (const [columnKey, yValues] of yByColumn) {
        yValues.sort((left, right) => left - right);
        if (yValues.length < 2) continue;

        const [xRaw, zRaw] = columnKey.split(",");
        const x = Number(xRaw);
        const z = Number(zRaw);
        const topY = yValues[yValues.length - 1];
        if (!hasNearbyLeavesForTreeColumn(x, z, topY, leafYByColumn)) continue;

        const y = yValues[1];
        secondFromBottomLogs.push({ x, y, z });
    }

    return secondFromBottomLogs;
};
