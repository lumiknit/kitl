// Editing Mode

import { faFile, faPenToSquare, faSquarePlus } from "@fortawesome/free-solid-svg-icons";

export enum EditingMode {
  File = 0,
  AddNode = 1,
  Edit = 2,
}

export const editingModeLabels = ["File", "Add Node", "Select & Edit"];

export const editingModeIcons = [
  faFile,
  faSquarePlus,
  faPenToSquare,
];

// Create node
