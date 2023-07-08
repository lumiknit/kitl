import * as jh from './helper';
import * as je from './edit';
import { faFile, faFileLines, faGripVertical, faSquarePen } from '@fortawesome/free-solid-svg-icons';

// Edit mode

export enum EditMode {
  Text = 0,
  Tree = 1,
  Edit = 2,
}

export const editModeLabels = ["Text", "Tree", "Select & Edit"];

export const editModeIcons = [
  faFileLines,
  faGripVertical,
  faSquarePen,
];

export type JsonEditorContextValue = {
  // File information
  path: string;

  // Editing content
  edit: je.JsonEdit;
  textModeError?: string;

  // Edit status and configurations
  editMode: EditMode;
  showStringEscape: boolean;
};

export const newContextValue = (
  path: string,
  value: jh.Json,
): JsonEditorContextValue => {
  return {
    path: path,
    edit: new je.JsonEdit(value),
    editMode: EditMode.Text,
    showStringEscape: false,
  };
};

export class JsonEditorContext {
  value: JsonEditorContextValue;
  updateValue: (value: JsonEditorContextValue) => void;

  // -- Methods

  // Constructor
  constructor(
    value: JsonEditorContextValue,
    updateValue: (value: JsonEditorContextValue) => void,
  ) {
    this.value = value;
    this.updateValue = updateValue;
  }

  updated() {
    this.updateValue({ ...this.value });
  }

  // Value
  downloadJson() {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  // context
  isTextMode() {
    return this.value.editMode === EditMode.Text;
  }

  updateMode(mode: EditMode) {
    const newValue = { ...this.value };
    newValue.editMode = mode;
    this.updateValue(newValue);
  }

  toggleStringEscape() {
    const newValue = { ...this.value };
    newValue.showStringEscape = !newValue.showStringEscape;
    this.updateValue(newValue);
  }
}