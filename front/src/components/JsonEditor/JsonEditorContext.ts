import * as h from "../helper";
import * as jh from "./helper";
import {
  faFileLines,
  faGripVertical,
  faSquarePen,
} from "@fortawesome/free-solid-svg-icons";

// Edit mode

export enum EditMode {
  Text = 0,
  Tree = 1,
  Edit = 2,
}

export const editModeLabels = ["Text", "Tree", "Select & Edit"];

export const editModeIcons = [faFileLines, faGripVertical, faSquarePen];

export type JsonEditorContextValue = {
  // File information
  path: string;

  // Edit status and configurations
  editMode: EditMode;
  textModeError?: string;
  showStringEscape: boolean;

  // Other method
  close?: (v: jh.Json) => void;
};

export const newContextValue = (path: string): JsonEditorContextValue => {
  return {
    path: path,
    editMode: h.isMobile() ? EditMode.Tree : EditMode.Text,
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

  // context
  isTextMode() {
    return this.value.editMode === EditMode.Text;
  }

  updateMode(mode: EditMode) {
    const newValue = { ...this.value };
    newValue.editMode = mode;
    newValue.textModeError = undefined;
    this.updateValue(newValue);
  }

  toggleStringEscape() {
    const newValue = { ...this.value };
    newValue.showStringEscape = !newValue.showStringEscape;
    this.updateValue(newValue);
  }
}
