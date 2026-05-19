import {
    ANOMALY_EVENT_TREE_LEAF_HORIZONTAL_RADIUS,
    ANOMALY_EVENT_TREE_LEAF_MAX_TOP_OFFSET,
    ANOMALY_EVENT_TREE_LEAF_MIN_TOP_OFFSET
} from "../config/constants";

export const hasNearbyLeavesForTreeColumn = (
    x: number,
    z: number,
    topY: number,
    leafYByColumn: Map<string, number[]>
): boolean => {
    for (let dx = -ANOMALY_EVENT_TREE_LEAF_HORIZONTAL_RADIUS; dx <= ANOMALY_EVENT_TREE_LEAF_HORIZONTAL_RADIUS; dx++) {
        for (let dz = -ANOMALY_EVENT_TREE_LEAF_HORIZONTAL_RADIUS; dz <= ANOMALY_EVENT_TREE_LEAF_HORIZONTAL_RADIUS; dz++) {
            const nearbyColumnKey = `${x + dx},${z + dz}`;
            const leafYValues = leafYByColumn.get(nearbyColumnKey);
            if (!leafYValues) continue;

            const minLeafY = topY + ANOMALY_EVENT_TREE_LEAF_MIN_TOP_OFFSET;
            const maxLeafY = topY + ANOMALY_EVENT_TREE_LEAF_MAX_TOP_OFFSET;
            for (const leafY of leafYValues) {
                if (leafY < minLeafY) continue;
                if (leafY > maxLeafY) continue;
                return true;
            }
        }
    }

    return false;
};
