export type GameDifficulty = "easy" | "standard" | "hard";
type StoredGameDifficulty = GameDifficulty | "normal";

const DEFAULT_GAME_DIFFICULTY: GameDifficulty = "standard";
let currentGameDifficulty: GameDifficulty = DEFAULT_GAME_DIFFICULTY;

const DIFFICULTY_USES_STORAGE_LOCK: Record<GameDifficulty, boolean> = {
    easy: false,
    standard: true,
    hard: true
};

const normalizeDifficulty = (difficulty: StoredGameDifficulty): GameDifficulty => {
    if (difficulty === "normal") return "standard";
    return difficulty;
};

export const getGameDifficulty = (): GameDifficulty => {
    return currentGameDifficulty;
};

export const setGameDifficulty = (difficulty: StoredGameDifficulty): void => {
    currentGameDifficulty = normalizeDifficulty(difficulty);
};

export const usesStorageLockByDifficulty = (): boolean => {
    return DIFFICULTY_USES_STORAGE_LOCK[getGameDifficulty()];
};
