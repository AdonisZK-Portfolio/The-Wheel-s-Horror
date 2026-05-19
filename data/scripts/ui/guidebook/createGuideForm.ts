import { ActionFormData } from "@minecraft/server-ui";
import { GUIDEBOOK_STYLED_BUTTON_LABELS } from "./guidebookStyle";
import { formatGuideTitle } from "./formatGuideTitle";

export const createGuideForm = (title: string, body: string): ActionFormData => {
    return new ActionFormData()
        .title(formatGuideTitle(title))
        .body(body)
        .button(GUIDEBOOK_STYLED_BUTTON_LABELS.back);
};
