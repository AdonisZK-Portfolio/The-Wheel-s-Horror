import type { ItemUseAfterEvent, Player } from "@minecraft/server";
import { GUIDEBOOK_ITEM_TYPE_ID, GUIDEBOOK_NAME_TAG } from "../config/guidebook";
import { REROLL_ITEM_NAME_TAG, REROLL_ITEM_TYPE_ID } from "../config/rerollItem";
import { sendRerollFailureMessage } from "../objective/reroll/sendRerollFailureMessage";
import { rerollActiveObjectiveForPlayer } from "../objective/rerollActiveObjectiveForPlayer";
import { showGuidebookOverviewForm } from "../ui/guidebook/showGuidebookOverviewForm";

export const onPlayerUseItem = (event: ItemUseAfterEvent): void => {
    const source = event.source;
    if (source.typeId !== "minecraft:player") return;

    const item = event.itemStack;
    if (item.typeId === REROLL_ITEM_TYPE_ID && item.nameTag === REROLL_ITEM_NAME_TAG) {
        const player = source as Player;
        const result = rerollActiveObjectiveForPlayer(player);
        if (!result.ok) {
            sendRerollFailureMessage(player, result.reason);
        }
        return;
    }

    if (item.typeId !== GUIDEBOOK_ITEM_TYPE_ID) return;
    if (item.nameTag !== GUIDEBOOK_NAME_TAG) return;

    showGuidebookOverviewForm(source as Player);
};
