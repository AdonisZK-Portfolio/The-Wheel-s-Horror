import type { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { showDifficultySettingsForm } from "../showDifficultySettingsForm";
import { GUIDEBOOK_BODY_COLORS, GUIDEBOOK_STYLED_BUTTON_LABELS, GUIDEBOOK_STYLED_TITLES } from "./guidebookStyle";
import { showGuidebookRulesIndexForm } from "./showGuidebookRulesIndexForm";

const { danger, friendly, reset } = GUIDEBOOK_BODY_COLORS;

const GUIDEBOOK_OVERVIEW_BODY = [
    `${danger}The Wheel's Horror${reset} is a survival horror addon built around forced timed objectives.`,
    "",
    "Complete the objective before the clock runs out and survival continues.",
    `${danger}Fail${reset} and ${danger}The Wheel${reset} spawns.`,
    "",
    "It cannot die. It does not stop.",
    "It ends when you do.",
    "",
    "The world does not help either.",
    `${friendly}Anomalies${reset} trigger while the clock runs, designed to distract, unsettle, and pull your focus away.`
].join("\n");

export const showGuidebookOverviewForm = (player: Player): void => {
    if (!player.isValid) return;

    const form = new ActionFormData()
        .title(GUIDEBOOK_STYLED_TITLES.overview)
        .body(GUIDEBOOK_OVERVIEW_BODY)
        .button(GUIDEBOOK_STYLED_BUTTON_LABELS.rules)
        .button(GUIDEBOOK_STYLED_BUTTON_LABELS.settings)
        .button(GUIDEBOOK_STYLED_BUTTON_LABELS.close);

    void form.show(player).then((response) => {
        if (response.canceled) return;
        if (response.selection === undefined) return;
        if (!player.isValid) return;

        if (response.selection === 0) {
            showGuidebookRulesIndexForm(player);
            return;
        }

        if (response.selection === 1) {
            showDifficultySettingsForm(player, {
                onBack: showGuidebookOverviewForm,
                backButtonLabel: GUIDEBOOK_STYLED_BUTTON_LABELS.back
            });
            return;
        }
    });
};
