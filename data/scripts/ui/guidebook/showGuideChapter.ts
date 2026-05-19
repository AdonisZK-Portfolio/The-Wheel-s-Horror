import type { Player } from "@minecraft/server";
import type { GuideEntry } from "./guidebookEntryTypes";
import { createGuideBody } from "./createGuideBody";
import { createGuideForm } from "./createGuideForm";

export const showGuideChapter = (
    player: Player,
    entry: GuideEntry,
    onBack: (player: Player) => void
): void => {
    if (!player.isValid) return;

    const body = createGuideBody(entry);
    const form = createGuideForm(entry.title, body);

    void form.show(player).then((response) => {
        if (response.canceled) return;
        if (response.selection === undefined) return;
        if (!player.isValid) return;

        onBack(player);
    });
};
