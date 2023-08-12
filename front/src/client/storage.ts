// File
export enum StorageItemType {
  NotFound = "not-found",
  File = "file",
  Directory = "directory",
}

export type StorageItem = {
  type: StorageItemType;
  name: string;
  size: number;
};

export interface IStorageClient {
  /* Query */
  getFileType(path: string): Promise<t.StorageItemType>;

  /* Operations */
  list(path: string): Promise<t.FileMeta[]>;
  mkdir(path: string): Promise<void>;

  read(path: string): Promise<string>;
  write(path: string, content: string): Promise<void>;

  delete(path: string): Promise<void>;
  rename(path: string, newPath: string): Promise<void>;
}