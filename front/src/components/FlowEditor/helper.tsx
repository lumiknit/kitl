// Editing Mode

import { TbEdit, TbSelectAll } from "react-icons/tb";

import i18n from "../../locales/i18n";
import { ReactElement } from "react-markdown/lib/react-markdown";

export enum EditingMode {
  Add = 0,
  Selection = 1,
}

export const editingModeLabels = [
  i18n.t("flowEditor.menu.addTools"),
  i18n.t("flowEditor.menu.selectTools"),
];

export const editingModeIcons: ReactElement[] = [<TbEdit />, <TbSelectAll />];

// Create node
