// File
export enum StorageItemType {
	NotFound,
	File,
	Directory,
}

export const STORAGE_ITEM_TYPE_NAMES = {
	[StorageItemType.NotFound]: "NotFound",
	[StorageItemType.File]: "File",
	[StorageItemType.Directory]: "Directory",
};

export type StorageItem = {
	type: StorageItemType;
	path: string;
	size: number;
	lastModified: Date;
};

export const StorageItemNotFound: StorageItem = {
	type: StorageItemType.NotFound,
	path: "",
	size: 0,
	lastModified: new Date(),
};

export interface IStorageClient {
	/* Query */
	stat(path: string): Promise<StorageItem>;

	/* Operations */
	mkdir(path: string): Promise<void>;
	list(path: string): Promise<StorageItem[]>;

	read(path: string): Promise<Uint8Array>;
	write(path: string, content: Uint8Array): Promise<StorageItem>;

	remove(path: string): Promise<void>;
	copy(path: string, newPath: string): Promise<void>;
	move(path: string, newPath: string): Promise<void>;
}
