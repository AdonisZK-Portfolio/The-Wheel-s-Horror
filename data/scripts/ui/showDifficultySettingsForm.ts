import type { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { formatDifficultySetMessage } from "../config/messages";
import { GameDifficulty, getGameDifficulty, setGameDifficulty } from "../config/settings";

const DIFFICULTY_ORDER: readonly GameDifficulty[] = ["easy", "standard", "hard"];

interface DifficultySettingsFormOptions {
    readonly onBack?: (player: Player) => void;
    readonly backButtonLabel?: string;
}

const formatDifficultyName = (difficulty: GameDifficulty): string => {
    if (difficulty === "standard") return "Standard";
    if (difficulty === "easy") return "Easy";
    return "Hard";
};

const getSettingsBody = (currentDifficulty: GameDifficulty): string => {
    return [
        `Current difficulty: ${formatDifficultyName(currentDifficulty)}`,
        "",
        "Easy keeps objective quantity at 1 and disables storage lock during active objectives.",
        "",
        "Standard keeps objective quantity at 1 and enables storage lock during active objectives.",
        "",
        "Hard randomizes objective quantity by tier (Easy 1-16, Medium 1-8, Hard 1-4, Very Hard 1) and keeps storage lock enabled during active objectives."
    ].join("\n");
};

export const showDifficultySettingsForm = (player: Player, options: DifficultySettingsFormOptions = {}): void => {
    if (!player.isValid) return;

    const currentDifficulty = getGameDifficulty();
    const form = new ActionFormData()
        .title("Wheel Settings")
        .body(getSettingsBody(currentDifficulty))
        .button("Select Easy")
        .button("Select Standard")
        .button("Select Hard");

    if (options.onBack) {
        form.button(options.backButtonLabel ?? "Back");
    }

    void form.show(player).then((response) => {
        if (response.canceled) return;
        if (response.selection === undefined) return;

        if (response.selection === DIFFICULTY_ORDER.length) {
            if (!player.isValid) return;
            if (!options.onBack) return;

            options.onBack(player);
            return;
        }

        const selectedDifficulty = DIFFICULTY_ORDER[response.selection];
        if (!selectedDifficulty) return;
        if (!player.isValid) return;

        setGameDifficulty(selectedDifficulty);
        player.sendMessage(formatDifficultySetMessage(formatDifficultyName(selectedDifficulty)));
    });
};
