import { IStorage } from "./Storage";
import { BrowserStorage } from "./BrowserStorage";

export class StorageManager {
  defaultStorage: string;
  storages: { [key: string]: IStorage };

  constructor() {
    this.defaultStorage = "browser";
    this.storages = {
      browser: new BrowserStorage(),
    };
  }

  register(name: string, storage: IStorage): void {
    if (this.storages[name] !== undefined) {
      throw new Error("Storage name already exists");
    }
    this.storages[name] = storage;
  }

  parsePath(path: string): [string, string] {
    const splitted = path.trim().split(":");
    if (splitted.length === 1) {
      return [this.defaultStorage, splitted[0]];
    } else if (splitted.length === 2) {
      return [splitted[0], splitted[1]];
    } else {
      throw new Error("Invalid path");
    }
  }

  /* Query */
  isFile(path: string): Promise<boolean> {
    const [storageName, storagePath] = this.parsePath(path);
    if (this.storages[storageName] === undefined) {
      throw new Error(`Storage not found: ${storageName}`);
    }
    return this.storages[storageName].isFile(storagePath);
  }

  isDirectory(path: string): Promise<boolean> {
    const [storageName, storagePath] = this.parsePath(path);
    if (this.storages[storageName] === undefined) {
      throw new Error(`Storage not found: ${storageName}`);
    }
    return this.storages[storageName].isDirectory(storagePath);
  }

  /* Operations */
  list(path: string): Promise<string[]> {
    const [storageName, storagePath] = this.parsePath(path);
    if (this.storages[storageName] === undefined) {
      throw new Error(`Storage not found: ${storageName}`);
    }
    return this.storages[storageName].list(storagePath);
  }

  mkdir(path: string): Promise<void> {
    const [storageName, storagePath] = this.parsePath(path);
    if (this.storages[storageName] === undefined) {
      throw new Error(`Storage not found: ${storageName}`);
    }
    return this.storages[storageName].mkdir(storagePath);
  }

  read(path: string): Promise<string> {
    const [storageName, storagePath] = this.parsePath(path);
    if (this.storages[storageName] === undefined) {
      throw new Error(`Storage not found: ${storageName}`);
    }
    return this.storages[storageName].read(storagePath);
  }

  write(path: string, content: string): Promise<void> {
    const [storageName, storagePath] = this.parsePath(path);
    if (this.storages[storageName] === undefined) {
      throw new Error(`Storage not found: ${storageName}`);
    }
    return this.storages[storageName].write(storagePath, content);
  }

  delete(path: string): Promise<void> {
    const [storageName, storagePath] = this.parsePath(path);
    if (this.storages[storageName] === undefined) {
      throw new Error(`Storage not found: ${storageName}`);
    }
    return this.storages[storageName].delete(storagePath);
  }

  rename(path: string, newPath: string): Promise<void> {
    const [storageName, storagePath] = this.parsePath(path);
    const [newStorageName, newStoragePath] = this.parsePath(newPath);
    if (this.storages[storageName] === undefined) {
      throw new Error(`Storage not found: ${storageName}`);
    }
    if (this.storages[newStorageName] === undefined) {
      throw new Error(`Storage not found: ${newStorageName}`);
    }
    if (storageName !== newStorageName) {
      throw new Error("Cannot rename across storages");
    }
    return this.storages[storageName].rename(storagePath, newStoragePath);
  }
}

export default new StorageManager();
