// Edit mode

export enum EditMode {
  Text = 0,
  Tree = 1,
  Select = 2,
}

export const editModeLabels = ["Text", "Tree", "Select"];

export const editModeIcons = ["body-text", "view-stacked", "pencil-square"];

export const isTextMode = (mode: EditMode) => mode === EditMode.Text;

export type Config = {
  editMode: EditMode;
  showStringEscape: boolean;
};
