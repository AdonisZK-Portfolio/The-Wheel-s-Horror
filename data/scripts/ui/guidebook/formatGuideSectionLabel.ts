import { GUIDEBOOK_BODY_COLORS, GUIDEBOOK_TEXT_STYLES } from "./guidebookStyle";

export const formatGuideSectionLabel = (label: string): string => {
    const { highlight, reset } = GUIDEBOOK_BODY_COLORS;
    const { bold } = GUIDEBOOK_TEXT_STYLES;

    return `${highlight}${bold}${label}${reset}`;
};

