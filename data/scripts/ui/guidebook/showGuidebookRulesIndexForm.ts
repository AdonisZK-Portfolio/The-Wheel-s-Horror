import type { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { GUIDE_ENTRIES } from "./guidebookEntries";
import type { GuideRoute } from "./guidebookEntryTypes";
import { formatGuideButtonLabel } from "./formatGuideButtonLabel";
import { GUIDEBOOK_BODY_COLORS, GUIDEBOOK_STYLED_BUTTON_LABELS, GUIDEBOOK_STYLED_TITLES } from "./guidebookStyle";
import { showGuidebookOverviewForm } from "./showGuidebookOverviewForm";
import { showGuidebookAnomaliesForm } from "./showGuidebookAnomaliesForm";
import { showGuidebookDifficultyAndModesForm } from "./showGuidebookDifficultyAndModesForm";
import { showGuidebookGettingStartedForm } from "./showGuidebookGettingStartedForm";
import { showGuidebookObjectiveRulesForm } from "./showGuidebookObjectiveRulesForm";
import { showGuidebookRerollsForm } from "./showGuidebookRerollsForm";

const { danger, success, friendly, highlight, reset } = GUIDEBOOK_BODY_COLORS;

const GUIDEBOOK_RULES_BODY = [
    `${highlight}Objectives${reset} tell you what to bring before the timer dies.`,
    `${success}Rerolls${reset} can save a bad target if you act in the first minute.`,
    `${friendly}Anomalies${reset} are distractions, warnings, and lies from the world around you.`,
    `${danger}Failure${reset} starts the chase. Read before you need it.`
].join("\n");

const routeToChapter = (player: Player, route: GuideRoute): void => {
    if (route === "show_getting_started") {
        showGuidebookGettingStartedForm(player);
        return;
    }
    if (route === "show_objective_rules") {
        showGuidebookObjectiveRulesForm(player);
        return;
    }
    if (route === "show_rerolls") {
        showGuidebookRerollsForm(player);
        return;
    }
    if (route === "show_difficulty_and_modes") {
        showGuidebookDifficultyAndModesForm(player);
        return;
    }
    if (route === "show_anomalies") {
        showGuidebookAnomaliesForm(player);
    }
};

export const showGuidebookRulesIndexForm = (player: Player): void => {
    if (!player.isValid) return;

    const form = new ActionFormData()
        .title(GUIDEBOOK_STYLED_TITLES.rulesIndex)
        .body(GUIDEBOOK_RULES_BODY);

    for (const entry of GUIDE_ENTRIES) {
        form.button(formatGuideButtonLabel(entry));
    }

    form.button(GUIDEBOOK_STYLED_BUTTON_LABELS.back);

    void form.show(player).then((response) => {
        if (response.canceled) return;
        if (response.selection === undefined) return;
        if (!player.isValid) return;

        if (response.selection === GUIDE_ENTRIES.length) {
            showGuidebookOverviewForm(player);
            return;
        }

        const selectedEntry = GUIDE_ENTRIES[response.selection];
        if (!selectedEntry) return;

        routeToChapter(player, selectedEntry.route);
    });
};
