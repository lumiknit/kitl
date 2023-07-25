// Editing Mode

import { faPenToSquare, faSquarePlus } from "@fortawesome/free-solid-svg-icons";

export enum EditingMode {
  AddNode = 0,
  Edit = 1,
}

export const editingModeLabels = ["Add Node", "Select & Edit"];

export const editingModeIcons = [faSquarePlus, faPenToSquare];

// Create node
