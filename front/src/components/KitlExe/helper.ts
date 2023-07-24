import * as t from "./op";

export const parseFnPath = (path: string): t.FnPath => {
  const idx = path.indexOf(";");
  if (idx < 0) {
    return { mod: "./.", name: path };
  } else {
    return {
      mod: path.slice(0, idx),
      name: path.slice(idx + 1),
    };
  }
};
