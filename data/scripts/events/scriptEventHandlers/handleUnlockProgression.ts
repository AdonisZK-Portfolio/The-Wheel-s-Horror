import type { ScriptEventHandlerContext } from "../scriptEventHandlerTypes";
import {
    MESSAGE_WHEEL_INVALID_PROGRESSION_KEY,
    MESSAGE_WHEEL_PROGRESSION_ALREADY_UNLOCKED
} from "../../config/messages";
import { hasPlayerProgressionKey } from "../../objective/progression/hasPlayerProgressionKey";
import { unlockPlayerProgressionKey } from "../../objective/progression/unlockPlayerProgressionKey";
import type { ProgressionKey } from "../../utils/types/ProgressionKey";

const PROGRESSION_KEY_DISPLAY_NAMES: Readonly<Record<ProgressionKey, string>> = {
    nether: "Nether",
    jungle: "Jungle",
    iron_age: "Iron Age",
    deep_cave: "Deep Cave",
    diamond_age: "Diamond Age",
    end: "End",
    silk_touch: "Silk Touch",
    enchanting: "Enchanting"
};

export const handleUnlockProgression = ({ player, message }: ScriptEventHandlerContext): void => {
    if (!player?.isValid) return;

    const normalizedMessage = message.trim().toLowerCase();
    const messageParts = normalizedMessage.split(/\s+/).filter((part) => part.length > 0);
    if (messageParts.length !== 1) {
        player.sendMessage(MESSAGE_WHEEL_INVALID_PROGRESSION_KEY);
        return;
    }

    const rawKey = messageParts[0];
    let key: ProgressionKey | undefined;

    if (rawKey === "nether") key = "nether";
    if (rawKey === "jungle") key = "jungle";
    if (rawKey === "iron_age") key = "iron_age";
    if (rawKey === "deep_cave") key = "deep_cave";
    if (rawKey === "diamond_age") key = "diamond_age";
    if (rawKey === "end") key = "end";
    if (rawKey === "silk_touch") key = "silk_touch";
    if (rawKey === "enchanting") key = "enchanting";

    if (!key) {
        player.sendMessage(MESSAGE_WHEEL_INVALID_PROGRESSION_KEY);
        return;
    }

    if (hasPlayerProgressionKey(player.id, key)) {
        player.sendMessage(MESSAGE_WHEEL_PROGRESSION_ALREADY_UNLOCKED.replace("{DisplayName}", PROGRESSION_KEY_DISPLAY_NAMES[key]));
        return;
    }

    unlockPlayerProgressionKey(player, key);
};
