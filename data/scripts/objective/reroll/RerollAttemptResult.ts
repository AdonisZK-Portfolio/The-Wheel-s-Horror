export type RerollFailureReason = "no_active_objective" | "locked" | "no_token";

export type RerollAttemptResult =
    | {
        readonly ok: true;
    }
    | {
        readonly ok: false;
        readonly reason: RerollFailureReason;
    };
