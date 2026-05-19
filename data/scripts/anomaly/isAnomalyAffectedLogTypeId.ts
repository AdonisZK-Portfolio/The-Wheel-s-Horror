import { ANOMALY_EVENT_AFFECTED_LOG_TYPE_IDS } from "../config/constants";

const ANOMALY_EVENT_AFFECTED_LOG_TYPE_IDS_SET = new Set<string>(ANOMALY_EVENT_AFFECTED_LOG_TYPE_IDS);

export const isAnomalyAffectedLogTypeId = (typeId: string): boolean => {
    return ANOMALY_EVENT_AFFECTED_LOG_TYPE_IDS_SET.has(typeId);
};
