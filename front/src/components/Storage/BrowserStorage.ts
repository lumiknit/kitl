import * as storage from "./Storage";

export type File = {
  key: string;
  type: storage.FileType.File;
  content: string;
};

export type Directory = {
  key: string;
  type: storage.FileType.Directory;
  children: {
    [key: string]: {
      key: string;
      type: storage.FileType;
    };
  };
};

export type StorageItem = File | Directory;

export class BrowserStorage implements storage.IStorage {
  type: string;
  localStoragePrefix: string;

  constructor() {
    this.type = "browser";
    this.localStoragePrefix = "kitl-storage--";
  }

  // Key issue

  issueKey(): string {
    const name = this.localStoragePrefix + "_key-cnt";
    let cnt = Number(localStorage.getItem(name));
    if (isNaN(cnt) || cnt < 0) {
      cnt = 0;
    }
    localStorage.setItem(name, String(cnt + 1));
    return String(cnt) + "-" + Math.random().toString(36).slice(2);
  }

  // Local storage access helper

  getItem(key: string): any {
    const item = localStorage.getItem(this.localStoragePrefix + key);
    if (item === null) {
      return undefined;
    }
    try {
      return JSON.parse(item);
    } catch (e) {
      return undefined;
    }
  }

  setItem(key: string, value: any): void {
    const j = JSON.stringify(value);
    localStorage.setItem(this.localStoragePrefix + key, j);
  }

  removeItem(key: string): void {
    localStorage.removeItem(this.localStoragePrefix + key);
  }

  // Meta helper

  getRoot(): Directory {
    // Try to get root
    const rootKey = "_root";
    const root = this.getItem(rootKey);
    if (root !== undefined) {
      if (root.type !== storage.FileType.Directory) {
        throw new Error("Root is not a directory");
      }
      return root;
    }
    // Create root
    const rootItem: Directory = {
      key: rootKey,
      type: storage.FileType.Directory,
      children: {},
    };
    this.setItem(rootKey, rootItem);
    return rootItem;
  }

  getStorageItem(path: string): StorageItem | undefined {
    const [isAbsolute, p] = storage.pathSplit(path);
    if (!isAbsolute) return;
    let s: StorageItem = this.getRoot();
    for (let i = 0; i < p.length; i++) {
      if (s.type !== storage.FileType.Directory) return;
      const c = s.children[p[i]];
      if (c === undefined) return;
      s = this.getItem(c.key);
      if (s === undefined) return;
    }
    return s;
  }

  // File type checker

  getFileType(path: string): Promise<storage.FileType | undefined> {
    const item = this.getStorageItem(path);
    return new Promise((resolve, reject) => {
      if (item === undefined) {
        reject({
          msg: "File not found",
          path: path,
        });
        return;
      }
      resolve(item.type);
    });
  }

  // Directory helper

  list(path: string): Promise<storage.FileMeta[]> {
    const item = this.getStorageItem(path);
    return new Promise((resolve, reject) => {
      if (item === undefined) {
        reject({
          msg: "File not found",
          path: path,
        });
        return;
      }
      if (item.type !== storage.FileType.Directory) {
        reject({
          msg: "Not a directory",
          path: path,
        });
        return;
      }
      const result = [];
      for (const [name, child] of Object.entries(item.children)) {
        result.push({
          type: child.type,
          name: name,
        });
      }
      resolve(result);
    });
  }

  mkdir(path: string): Promise<void> {
    const [dir, file] = storage.splitFileName(path);
    const item = this.getStorageItem(dir);
    return new Promise((resolve, reject) => {
      if (item === undefined) {
        reject({
          msg: "Path not found",
          path: dir,
        });
        return;
      }
      if (item.type !== storage.FileType.Directory) {
        reject({
          msg: "Not a directory",
          path: dir,
        });
        return;
      }
      if (item.children[file] !== undefined) {
        reject({
          msg: "File already exists",
          path: path,
        });
        return;
      }
      // Create directory item
      const key = this.issueKey();
      const newItem = {
        key: key,
        type: storage.FileType.Directory,
        children: [],
      };
      this.setItem(key, newItem);
      // Add to parent
      const newParent = {
        key: item.key,
        type: storage.FileType.Directory,
        children: {
          ...item.children,
          [file]: {
            key: key,
            type: storage.FileType.Directory,
          },
        },
      };
      this.setItem(item.key, newParent);
      resolve();
    });
  }

  read(path: string): Promise<string> {
    const item = this.getStorageItem(path);
    return new Promise((resolve, reject) => {
      if (item === undefined) {
        reject({
          msg: "File not found",
          path: path,
        });
        return;
      }
      if (item.type !== storage.FileType.File) {
        reject({
          msg: "Not a file",
          path: path,
        });
        return;
      }
      resolve(atob(item.content));
    });
  }

  write(path: string, content: string): Promise<void> {
    const [dir, file] = storage.splitFileName(path);
    let item = this.getStorageItem(path);
    return new Promise((resolve, reject) => {
      if (item === undefined) {
        // Create new file
        const parent = this.getStorageItem(dir);
        if (parent === undefined) {
          reject({
            msg: "Path not found",
            path: dir,
          });
          return;
        }
        if (parent.type !== storage.FileType.Directory) {
          reject({
            msg: "Not a directory",
            path: dir,
          });
          return;
        }
        if (parent.children[file] !== undefined) {
          reject({
            msg: "File already exists",
            path: path,
          });
          return;
        }
        const key = this.issueKey();
        // Add to parent
        const newParent = {
          key: parent.key,
          type: storage.FileType.Directory,
          children: {
            ...parent.children,
            [file]: {
              key: key,
              type: storage.FileType.File,
            },
          },
        };
        this.setItem(parent.key, newParent);
        // Create a file
        item = {
          key: key,
          type: storage.FileType.File,
          content: btoa(content),
        };
      }
      if (item.type !== storage.FileType.File) {
        reject({
          msg: "Not a file",
          path: path,
        });
        return;
      }
      const newItem = {
        key: item.key,
        type: storage.FileType.File,
        content: btoa(content),
      };
      this.setItem(item.key, newItem);
      resolve();
    });
  }

  delete(path: string): Promise<void> {
    const [dir, file] = storage.splitFileName(path);
    const item = this.getStorageItem(dir);
    return new Promise((resolve, reject) => {
      if (item === undefined) {
        reject({
          msg: "Path not found",
          path: dir,
        });
        return;
      }
      if (item.type !== storage.FileType.Directory) {
        reject({
          msg: "Not a directory",
          path: dir,
        });
        return;
      }
      if (item.children[file] === undefined) {
        reject({
          msg: "File not found",
          path: path,
        });
        return;
      }
      const child = item.children[file];
      if (child.type === storage.FileType.Directory) {
        // Delete items recursively
        const queue = [child.key];
        while (queue.length > 0) {
          const key = queue.shift();
          if (key === undefined) continue;
          const item = this.getItem(key);
          if (item === undefined) continue;
          if (item.type === storage.FileType.Directory) {
            for (const child of item.children) {
              queue.push(child.key);
            }
          }
          this.removeItem(key);
        }
      }
      // Delete file
      this.removeItem(child.key);
      // Delete from parent
      const newChildren = { ...item.children };
      delete newChildren[file];
      const newParent = {
        key: item.key,
        type: storage.FileType.Directory,
        children: newChildren,
      };
      this.setItem(item.key, newParent);
      resolve();
    });
  }

  rename(oldPath: string, newPath: string): Promise<void> {
    const [oP, oF] = storage.splitFileName(oldPath);
    const [nP, nF] = storage.splitFileName(newPath);
    const oItem = this.getStorageItem(oP);
    let nItem = this.getStorageItem(nP);
    return new Promise((resolve, reject) => {
      if (oItem === undefined) {
        reject({
          msg: "Path not found",
          path: oP,
        });
        return;
      }
      if (oItem.type !== storage.FileType.Directory) {
        reject({
          msg: "Not a directory",
          path: oP,
        });
        return;
      }
      if (oItem.children[oF] === undefined) {
        reject({
          msg: "File not found",
          path: oldPath,
        });
        return;
      }
      if (nItem === undefined) {
        reject({
          msg: "Path not found",
          path: nP,
        });
        return;
      }
      if (nItem.type !== storage.FileType.Directory) {
        reject({
          msg: "Not a directory",
          path: nP,
        });
        return;
      }
      if (nItem.children[nF] !== undefined) {
        reject({
          msg: "File already exists",
          path: newPath,
        });
        return;
      }
      const child = oItem.children[oF];
      // Delete from parent
      const newChildren = { ...oItem.children };
      delete newChildren[oF];
      const newParent = {
        key: oItem.key,
        type: storage.FileType.Directory,
        children: newChildren,
      };
      this.setItem(oItem.key, newParent);
      nItem = this.getStorageItem(nP);
      if (nItem === undefined || nItem.type !== storage.FileType.Directory) {
        reject({
          msg: "Path not found",
          path: nP,
        });
        return;
      }
      // Add to new parent
      const newChildren2 = { ...nItem.children, [nF]: child };
      const newParent2 = {
        key: nItem.key,
        type: storage.FileType.Directory,
        children: newChildren2,
      };
      this.setItem(nItem.key, newParent2);
      resolve();
    });
  }
}
