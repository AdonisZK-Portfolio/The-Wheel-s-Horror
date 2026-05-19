export const getSearchWheelOwnerTagForPlayerId = (playerId: string): string => {
    const normalizedPlayerId = playerId
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_");

    return `the_wheel_owner_${normalizedPlayerId}`;
};
