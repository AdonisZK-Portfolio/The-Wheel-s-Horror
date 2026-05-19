import type { GuideEntry } from "./guidebookEntryTypes";
import { formatGuideSectionLabel } from "./formatGuideSectionLabel";

export const createGuideBody = (entry: GuideEntry): string => {
    const lines: string[] = [
        formatGuideSectionLabel("Description"),
        entry.description,
    ];

    if (entry.requirements.length > 0) {
        lines.push("");
        lines.push(formatGuideSectionLabel("Requirements"));
        for (const req of entry.requirements) {
            lines.push(`- ${req}`);
        }
    }

    if (entry.compatibleMobs.length > 0) {
        lines.push("");
        lines.push(formatGuideSectionLabel("Works On"));
        for (const mob of entry.compatibleMobs) {
            lines.push(`- ${mob}`);
        }
    }

    lines.push("");
    lines.push(formatGuideSectionLabel("Effect"));
    lines.push(entry.effect);

    lines.push("");
    lines.push(formatGuideSectionLabel("Action"));
    lines.push(entry.action);

    return lines.join("\n");
};
