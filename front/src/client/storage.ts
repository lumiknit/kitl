// File
export enum StorageItemType {
  NotFound,
  File,
  Directory,
}

export type StorageItem = {
  type: StorageItemType;
  name: string;
  size: number;
};

export interface IStorageClient {
  /* Query */
  getFileType(path: string): Promise<StorageItemType>;

  /* Operations */
  mkdir(path: string): Promise<void>;
  list(path: string): Promise<StorageItem[]>;

  read(path: string): Promise<string>;
  write(path: string, content: string): Promise<void>;

  remove(path: string): Promise<void>;
  copy(path: string, newPath: string): Promise<void>;
  move(path: string, newPath: string): Promise<void>;
}
