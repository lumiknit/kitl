// Editing Mode

import { faPenToSquare, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import i18n from "../../locales/i18n";

export enum EditingMode {
  Add = 0,
  Selection = 1,
}

export const editingModeLabels = [
  i18n.t("flowEditor.menu.addTools"),
  i18n.t("flowEditor.menu.selectTools"),
];

export const editingModeIcons = [faSquarePlus, faPenToSquare];

// Create node
