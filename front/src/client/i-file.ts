export enum FileType {
	Directory,
	File,
}

export type FileMeta = {
	type: FileType;
	name: string;
	lastModified: Date;
};

export interface IFileSystem {
	// stat: Get metadata for a file or directory.
	stat(path: string): FileMeta;
	
	// mkdir: create a new directory.
	mkdir(path: string): void;
	// list: list the contents of a directory.
	list(path: string): string[];

	// read: read the contents of a file.
	read(path: string): Uint8Array;
	// write: write the contents of a file.
	write(path: string, data: Uint8Array): void;

	// remove: remove a file or directory.
	remove(path: string): void;
	
	// move: move a file or directory.
	move(from: string, to: string): void;
	// copy: copy a file or directory.
	copy(from: string, to: string): void;
}