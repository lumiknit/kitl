// File
export enum StorageItemType {
	NotFound,
	File,
	Directory,
}

export type StorageItem = {
	type: StorageItemType;
	path: string;
	size: number;
	lastModified: Date;
};

export interface IStorageClient {
	/* Query */
	stat(path: string): Promise<StorageItem>;

	/* Operations */
	mkdir(path: string): Promise<void>;
	list(path: string): Promise<StorageItem[]>;

	read(path: string): Promise<Uint8Array>;
	write(path: string, content: Uint8Array): Promise<void>;

	remove(path: string): Promise<void>;
	copy(path: string, newPath: string): Promise<void>;
	move(path: string, newPath: string): Promise<void>;
}
