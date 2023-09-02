// Clipboard helpers

let clipboard: string = "";

const clipboardAPISupported =
  navigator.clipboard !== undefined &&
  navigator.clipboard.readText !== undefined &&
  navigator.clipboard.writeText !== undefined;

export const saveString = (value: string) => {
  // Save the value into the clipboard
  if (clipboardAPISupported) {
    navigator.clipboard.writeText(value);
  } else {
    clipboard = value;
  }
};

export const loadString = (): Promise<string> => {
  // Load the value from the clipboard
  if (clipboardAPISupported) {
    return navigator.clipboard.readText();
  } else {
    return Promise.resolve(clipboard);
  }
};
