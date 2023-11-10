import {
	Path,
	PathString,
	isAbsolutePath,
	joinPath,
	refinePath,
	str2arr,
	ab2str,
} from "@/common";
import { StorageItemType, StorageItem } from "./storage";

/* Indexed DB based file system */

const dbName = "kitl-idbfs";
const dbVersion = 1;
const dbStoreMeta = "meta";
const dbStoreData = "data";

/* Types */

type StorageItemMeta = {
	path: string;
	type: StorageItemType;
	size: number;
	lastModified: number;
};

const notFound: StorageItemMeta = {
	path: "",
	type: StorageItemType.NotFound,
	size: 0,
	lastModified: 0,
};

type StorageItemData = {
	path: string;
	data: Uint8Array;
};

// Async wrapper

class StoreW<T> {
	transaction: IDBTransaction;
	store: IDBObjectStore;

	constructor(transaction: IDBTransaction, storeName: string) {
		this.transaction = transaction;
		this.store = this.transaction.objectStore(storeName);
	}

	r<T>(f: () => IDBRequest<T>): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			const req = f();
			req.onsuccess = () => resolve(req.result);
			req.onerror = () => {
				console.error(req.error);
				reject(req.error);
			};
		});
	}

	get(key: string): Promise<T> {
		return this.r(() => this.store.get(key));
	}

	getAll(): Promise<T[]> {
		return this.r(() => this.store.getAll());
	}

	put(value: T, key?: string): Promise<IDBValidKey> {
		return this.r(() => this.store.put(value, key));
	}

	delete(key: string): Promise<void> {
		return this.r(() => this.store.delete(key));
	}

	clear(): Promise<void> {
		return this.r(() => this.store.clear());
	}
}

const pPath = (path: string): [PathString, Path] => {
	// Check path is absolute and refine it
	const [p, chunks] = refinePath(path);
	if (!isAbsolutePath(chunks)) {
		throw new Error("Path must be absolute");
	}
	return [p, chunks];
};

export class IDBFS {
	readwrite: boolean;
	meta: StoreW<StorageItemMeta>;
	data: StoreW<StorageItemData>;

	constructor(
		readwrite: boolean,
		meta: StoreW<StorageItemMeta>,
		data: StoreW<StorageItemData>,
	) {
		this.readwrite = readwrite;
		this.meta = meta;
		this.data = data;
	}

	/* Helper */

	shouldWritable() {
		if (!this.readwrite) {
			throw new Error(
				"Failed to process: IDBFS is created as readonly mode.",
			);
		}
	}

	async getMeta(path: string): Promise<StorageItemMeta> {
		try {
			return await this.meta.get(path);
		} catch {
			return notFound;
		}
	}

	public async rawWrite(
		type: StorageItemType,
		path: string,
		data: Uint8Array,
	): Promise<void> {
		console.log("rawWrite", path, type, data.byteLength);
		await this.meta.put({
			path,
			type: type,
			size: data.byteLength,
			lastModified: Date.now(),
		});
		// Write a file data
		await this.data.put({
			path,
			data: data,
		});
	}

	/* Initialize */

	public async format() {
		// Clear all data
		await this.meta.clear();
		await this.data.clear();
		// Write root directory
		await this.rawWrite(StorageItemType.Directory, "/", str2arr(""));
	}

	/* File type */
	public async getFileType(path: string): Promise<StorageItemType> {
		const [p] = pPath(path);
		try {
			const r = await this.meta.get(p);
			console.log(r);
			return r.type;
		} catch {
			return StorageItemType.NotFound;
		}
	}

	/* Directory */

	public async mkdir(path: string): Promise<void> {
		this.shouldWritable();
		// Find the first existing parent directory
		const [, chunks] = pPath(path);
		let i = chunks.length;
		for (; i >= 1; --i) {
			const p = joinPath(chunks.slice(0, i));
			const t = await this.getFileType(p);
			if (t === StorageItemType.Directory) {
				break;
			} else if (t !== StorageItemType.NotFound) {
				throw new Error("File exists");
			}
		}
		// Read the parent directory
		const parent = joinPath(chunks.slice(0, i));
		const children = await this.getChildrenNames(parent);
		console.log("mkdir - Write", parent, children);
		children.push(chunks[i]);
		await this.rawWrite(
			StorageItemType.Directory,
			parent,
			str2arr(children.join("\n")),
		);
		// Create directories
		for (++i; i <= chunks.length; ++i) {
			const path = joinPath(chunks.slice(0, i));
			console.log("Create", path, chunks[i]);
			// Write a directory meta
			const data =
				i < chunks.length ? str2arr(chunks[i]) : new Uint8Array(0);
			await this.rawWrite(StorageItemType.Directory, path, data);
		}
	}

	public async getChildrenNames(path: string): Promise<string[]> {
		// Return all children names of directory
		const [p] = pPath(path);
		// Check if the path is a directory
		const r = await this.meta.get(p);
		if (r.type !== StorageItemType.Directory) {
			throw new Error("Not a directory");
		}
		// List all files and directories
		const data = await this.data.get(p);
		return ab2str(data.data)
			.split("\n")
			.map(s => s.trim())
			.filter(s => s.length > 0);
	}

	public async list(path: string): Promise<StorageItem[]> {
		const fileNames = await this.getChildrenNames(path);
		const lst: StorageItem[] = [];
		for (const name of fileNames) {
			const [p] = refinePath(`${path}/${name}`);
			const meta = await this.meta.get(p);
			console.log(p, meta);
			lst.push({
				...meta,
				lastModified: new Date(meta.lastModified),
			});
		}
		return lst;
	}

	/* File */

	public async write(path: string, content: Uint8Array): Promise<void> {
		// Find the first existing parent directory
		const [refinedPath, chunks] = pPath(path);
		// Check file exists
		const t = await this.getFileType(path);
		if (t === StorageItemType.NotFound) {
			// Create new one
			const parent = joinPath(chunks.slice(0, chunks.length - 1));
			const parentType = await this.getFileType(parent);
			if (parentType !== StorageItemType.Directory) {
				throw new Error("Parent directory does not exist");
			}
			const children = await this.getChildrenNames(parent);
			children.push(chunks[chunks.length - 1]);
			await this.rawWrite(
				StorageItemType.Directory,
				parent,
				str2arr(children.join("\n")),
			);
		} else if (t !== StorageItemType.File) {
			throw new Error("Cannot create a file: directory exists");
		}
		// Write a file meta
		await this.rawWrite(StorageItemType.File, refinedPath, content);
	}

	public async read(path: string): Promise<Uint8Array> {
		const [p] = pPath(path);
		// Check if the path is a file
		const t = await this.getFileType(p);
		if (t !== StorageItemType.File) {
			throw new Error("Not a file");
		}
		// Read a file data
		const data = await this.data.get(p);
		return data.data;
	}

	/* Remove */
	public async remove(path: string): Promise<void> {
		const [p, chunks] = pPath(path);
		if (p.length <= 1) {
			// Format
			return await this.format();
		}
		const parentPath = joinPath(chunks.slice(0, chunks.length - 1));
		let parent: StorageItemMeta;
		// Check the file or directory exists
		try {
			await this.meta.get(p);
			parent = await this.meta.get(parentPath);
			if (parent.type !== StorageItemType.Directory) {
				throw new Error("Parent is not a directory");
			}
		} catch {
			throw new Error("File or directory does not exist");
		}
		// Remove all children
		const lst = await this.meta.getAll();
		for (const r of lst) {
			if (r.path === p || r.path.startsWith(p + "/")) {
				await this.meta.delete(r.path);
				await this.data.delete(r.path);
			}
		}
		// Remove from parent
		const children = await this.getChildrenNames(parentPath);
		const filtered = children.filter(c => c !== chunks[chunks.length - 1]);
		await this.rawWrite(
			StorageItemType.Directory,
			parentPath,
			str2arr(filtered.join("\n")),
		);
	}

	/* File */
	public async copy(oldPath: string, newPath: string): Promise<void> {
		const [op] = pPath(oldPath);
		const [np] = pPath(newPath);
		if (np.startsWith(op)) {
			throw new Error("Cannot copy to a subdirectory");
		}
		// Get all paths to be moved
		const lst = await this.meta.getAll();
		const paths = lst
			.map(r => r.path)
			.filter(p => p === op || p.startsWith(op + "/"))
			.map(p => p.slice(op.length));
		// Move all paths
		for (const p of paths) {
			const src = op + p;
			const dst = np + p;
			const r = await this.meta.get(src);
			const d = await this.data.get(src);
			await this.rawWrite(r.type, dst, d.data);
		}
	}

	public async move(oldPath: string, newPath: string): Promise<void> {
		await this.copy(oldPath, newPath);
		await this.remove(oldPath);
	}
}

const openDB = () => {
	return new Promise<IDBDatabase>((resolve, reject) => {
		const req = indexedDB.open(dbName, dbVersion);
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
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

export const openfs = async (readwrite?: boolean) => {
	const db = await openDB();
	const transaction = db.transaction(
		[dbStoreMeta, dbStoreData],
		readwrite ? "readwrite" : "readonly",
	);
	return new IDBFS(
		readwrite === true,
		new StoreW<StorageItemMeta>(transaction, dbStoreMeta),
		new StoreW<StorageItemData>(transaction, dbStoreData),
	);
};

export const checkfs = async () => {
	// Open fs and if it fails, format it
	const fs = await openfs(true);
	try {
		const type = await fs.getFileType("/");
		if (type !== StorageItemType.Directory) {
			throw new Error("Not a directory");
		}
	} catch {
		console.warn("IDBFS is broken. Format it.");
		await fs.format();
	}
};
