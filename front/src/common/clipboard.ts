// Clipboard helpers

let clipboard: string = "";

export const saveString = (value: string) => {
  // Save the value into the clipboard
  if (navigator.clipboard) {
    navigator.clipboard.writeText(value);
  } else {
    clipboard = value;
  }
};

export const loadString = (): Promise<string> => {
  // Load the value from the clipboard
  if (navigator.clipboard) {
    return navigator.clipboard.readText();
  } else {
    return Promise.resolve(clipboard);
  }
};
