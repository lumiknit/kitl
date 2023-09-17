import { StorageItemType, StorageItem } from "./storage";

/* Indexed DB based file system */

const dbName = "kitl-idbfs";
const dbVersion = 1;
const dbStoreMeta = "meta";
const dbStoreData = "data";

/* Helpers */

const str2ab = (str: string) => {
  const te = new TextEncoder();
  const encoded = te.encode(str);
  const buf = new ArrayBuffer(encoded.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0; i < encoded.length; ++i) {
    bufView[i] = encoded[i];
  }
  return buf;
};

const ab2str = (buf: ArrayBuffer) => {
  const td = new TextDecoder();
  return td.decode(buf);
};

const splitPath = (path: string) => {
  if (path[0] !== "/") {
    throw new Error("Invalid path: path must start with /");
  }
  const chunks = path.split("/");
  const paths = [];
  for (const c of chunks) {
    switch (c) {
      case "":
      case ".":
        break;
      case "..":
        paths.pop();
        break;
      default:
        paths.push(c);
    }
  }
  return paths;
};

const joinPath = (paths: string[]) => {
  return "/" + paths.join("/");
};

const refinePath = (path: string): [string, string[]] => {
  const chunks = splitPath(path);
  return [joinPath(chunks), chunks];
};

/* Types */

type StorageItemMeta = {
  path: string;
  type: StorageItemType;
  size: number;
  lastModified: number;
};

type StorageItemData = {
  path: string;
  data: ArrayBuffer;
};

const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(dbName, dbVersion);
    req.onsuccess = () => {
      resolve(req.result);
    };
    req.onerror = () => {
      reject(req.error);
    };
    req.onupgradeneeded = event => {
      const db = req.result;
      if (event.oldVersion === 0) {
        db.createObjectStore(dbStoreMeta, { keyPath: "path" });
        db.createObjectStore(dbStoreData, { keyPath: "path" });
        resolve(db);
      } else {
        reject(req.error);
      }
    };
  });
};

class StoreW<T> {
  transaction: IDBTransaction;
  store: IDBObjectStore;

  constructor(transaction: IDBTransaction, storeName: string) {
    this.transaction = transaction;
    this.store = this.transaction.objectStore(storeName);
  }

  async get(key: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const req = this.store.get(key);
      req.onsuccess = () => {
        resolve(req.result);
      };
      req.onerror = () => {
        reject(req.error);
      };
    });
  }

  async getAll(): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      const req = this.store.getAll();
      req.onsuccess = () => {
        resolve(req.result);
      };
      req.onerror = () => {
        reject(req.error);
      };
    });
  }

  async put(value: T, key?: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const req = this.store.put(value, key);
      req.onsuccess = () => {
        resolve();
      };
      req.onerror = () => {
        reject(req.error);
      };
    });
  }

  async delete(key: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const req = this.store.delete(key);
      req.onsuccess = () => {
        resolve();
      };
      req.onerror = () => {
        reject(req.error);
      };
    });
  }
}

const openStores = async (
  mode: IDBTransactionMode,
): Promise<{
  meta: StoreW<StorageItemMeta>;
  data: StoreW<StorageItemData>;
}> => {
  const db = await openDB();
  const transaction = db.transaction([dbStoreMeta, dbStoreData], mode);
  return {
    meta: new StoreW<StorageItemMeta>(transaction, dbStoreMeta),
    data: new StoreW<StorageItemData>(transaction, dbStoreData),
  };
};

export class IDBFS {
  constructor() {}

  async getMeta(path: string) {
    const s = await openStores("readonly");
    const r = await s.meta.get(path);
    return r;
  }

  /* File type */
  public async getFileType(path: string): Promise<StorageItemType> {
    const s = await openStores("readonly");
    const [p] = refinePath(path);
    try {
      const r = await s.meta.get(p);
      return r.type;
    } catch {
      return StorageItemType.NotFound;
    }
  }

  public async isFile(path: string): Promise<boolean> {
    const type = await this.getFileType(path);
    return type === StorageItemType.File;
  }

  public async isDirectory(path: string): Promise<boolean> {
    const type = await this.getFileType(path);
    return type === StorageItemType.Directory;
  }

  /* Directory */

  public async mkdir(path: string): Promise<void> {
    const s = await openStores("readonly");
    // Find the first existing parent directory
    const [, chunks] = refinePath(path);
    let i = chunks.length;
    for (; i >= 0; --i) {
      const p = chunks.slice(0, i).join("/");
      try {
        const r = await s.meta.get(p);
        if (r.type === StorageItemType.Directory) {
          break;
        } else if (r.type === StorageItemType.File) {
          throw new Error("File exists");
        }
      } catch {
        continue;
      }
    }
    // Create directories
    for (++i; i < chunks.length; ++i) {
      const path = chunks.slice(0, i).join("/");
      const data = i < chunks.length ? str2ab(chunks[i]) : new ArrayBuffer(0);
      await s.meta.put({
        path,
        type: StorageItemType.Directory,
        size: data.byteLength,
        lastModified: Date.now(),
      });
      await s.data.put({
        path,
        data: data,
      });
    }
  }

  public async getFileNames(path: string): Promise<string[]> {
    const s = await openStores("readonly");
    const [p] = refinePath(path);
    // Check if the path is a directory
    const r = await s.meta.get(p);
    if (r.type !== StorageItemType.Directory) {
      throw new Error("Not a directory");
    }
    // List all files and directories
    const data = await s.data.get(p);
    const lst = ab2str(data.data)
      .split("\n")
      .map(s => s.trim())
      .filter(s => s.length > 0);
    return lst;
  }

  public async list(path: string): Promise<StorageItem[]> {
    const s = await openStores("readonly");
    const fileNames = await this.getFileNames(path);
    const lst = [];
    for (const name of fileNames) {
      const p = joinPath([path, name]);
      const meta = await s.meta.get(p);
      lst.push({
        type: meta.type,
        name,
        size: meta.size,
      });
    }
    return lst;
  }

  /* File */

  public async write(path: string, content: string): Promise<void> {
    const s = await openStores("readonly");
    // Find the first existing parent directory
    const [, chunks] = refinePath(path);

    // Check file exists
    if (!this.isFile(path)) {
      // Then, check if parent directory exists
      const parent = joinPath(chunks.slice(0, chunks.length - 1));
      if (!this.isDirectory(parent)) {
        throw new Error("Parent directory does not exist");
      }
      // Write a file meta
      await s.meta.put({
        path,
        type: StorageItemType.File,
        size: content.length,
        lastModified: Date.now(),
      });
      // Create a file in the directory
      const data = await s.data.get(parent);
      const lst = ab2str(data.data)
        .split("\n")
        .map(s => s.trim())
        .filter(s => s.length > 0);
      lst.push(chunks[chunks.length - 1]);
      await s.data.put({
        path: parent,
        data: str2ab(lst.join("\n")),
      });
    }
    // Write a file data
    await s.data.put({
      path,
      data: str2ab(content),
    });
  }

  public async read(path: string): Promise<string> {
    const s = await openStores("readonly");
    const [p] = refinePath(path);
    // Check if the path is a file
    const r = await s.meta.get(p);
    if (r.type !== StorageItemType.File) {
      throw new Error("Not a file");
    }
    // Read a file data
    const data = await s.data.get(p);
    return ab2str(data.data);
  }

  /* Remove */
  public async remove(path: string): Promise<void> {
    const [p] = refinePath(path);
    if (p.length <= 1) {
      throw new Error("Cannot remove root directory");
    }
    const s = await openStores("readonly");
    // Check the file or directory exists
    try {
      await s.meta.get(p);
    } catch {
      throw new Error("File or directory does not exist");
    }
    // Remove all children
    const lst = await s.meta.getAll();
    for (const r of lst) {
      if (r.path === p || r.path.startsWith(p + "/")) {
        await s.meta.delete(r.path);
        await s.data.delete(r.path);
      }
    }
  }

  /* File */
  public async copy(oldPath: string, newPath: string): Promise<void> {
    const [op] = refinePath(oldPath);
    const [np] = refinePath(newPath);
    // Get all paths to be moved
    const s = await openStores("readonly");
    const lst = await s.meta.getAll();
    const paths = lst
      .map(r => r.path)
      .filter(p => p === op || p.startsWith(op + "/"))
      .map(p => p.slice(op.length));
    // Move all paths
    for (const p of paths) {
      const src = op + p;
      const dst = np + p;
      const r = await s.meta.get(src);
      await s.meta.put({
        ...r,
        path: dst,
        lastModified: Date.now(),
      });
      const d = await s.data.get(src);
      await s.data.put({
        ...d,
        path: dst,
      });
    }
  }

  public async move(oldPath: string, newPath: string): Promise<void> {
    await this.copy(oldPath, newPath);
    await this.remove(oldPath);
  }
}

console.log(new IDBFS().getMeta("/"));
