export const getPlayerStatePropertyKey = (playerName: string): string => {
    return `twh:player_state:${playerName.toLowerCase()}`;
};
