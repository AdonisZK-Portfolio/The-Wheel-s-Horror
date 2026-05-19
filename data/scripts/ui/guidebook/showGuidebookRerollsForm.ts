import type { Player } from "@minecraft/server";
import { GUIDE_ENTRIES } from "./guidebookEntries";
import { showGuideChapter } from "./showGuideChapter";
import { showGuidebookRulesIndexForm } from "./showGuidebookRulesIndexForm";

const entry = GUIDE_ENTRIES.find((e) => e.route === "show_rerolls");

export const showGuidebookRerollsForm = (player: Player): void => {
    if (!entry) return;
    showGuideChapter(player, entry, showGuidebookRulesIndexForm);
};
