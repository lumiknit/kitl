export enum FileType {
  File = "file",
  Directory = "directory",
}

export interface IStorage {
  /* Type */
  type: string;

  /* Query */
  isFile(path: string): Promise<boolean>;
  isDirectory(path: string): Promise<boolean>;

  /* Operations */
  list(path: string): Promise<string[]>;
  mkdir(path: string): Promise<void>;
  read(path: string): Promise<string>;
  write(path: string, content: string): Promise<void>;
  delete(path: string): Promise<void>;
  rename(path: string, newPath: string): Promise<void>;
}

export const isValidPath = (path: string): boolean => {
  return path.match(/[#$%&*<>"?:;|*]/) === null;
};

export const pathSplit = (path: string, relativePath?: string): [boolean, string[]] => {
  let splitted = path.trim().toLowerCase().split(/[\\/]+/);
  if(relativePath !== undefined) {
    const relativeSplitted = relativePath.trim().toLowerCase().split(/[\\/]+/);
    if(relativeSplitted[0] === "") {
      // Absolute path
      splitted = relativeSplitted;
    } else {
      // Relative path
      splitted = splitted.concat(relativeSplitted);
    }
  }
  const result = [];
  const isAbsolute = splitted[0] === "";
  for(let i = 0; i < splitted.length; i++) {
    const s = splitted[i];
    if(s === "" || s === ".") continue;
    else if(s === "..") {
      if(result.length > 0) result.pop();
    } else {
      result.push(s);
    }
  }
  return [isAbsolute, result];
};

export const cd = (path: string, relativePath?: string): string => {
  const [isAbsolute, p] = pathSplit(path, relativePath);
  return (isAbsolute ? "/" : "") + p.join("/");
};

export const splitFileName = (path: string): [string, string] => {
  const [isAbsolute, splitted] = pathSplit(path);
  const name = splitted[splitted.length - 1];
  const dir = (isAbsolute ? "/" : "") + splitted.slice(0, splitted.length - 1).join("/");
  return [dir, name];
};