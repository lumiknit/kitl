import {
	Path,
	PathString,
	isAbsolutePath,
	joinPath,
	refinePath,
	str2arr,
	ab2str,
} from "@/common";
import {
	StorageItemType,
	StorageItem,
	STORAGE_ITEM_TYPE_NAMES,
} from "./storage";

/* Errors */

export class StorageItemTypeMismatchError extends Error {
	constructor(
		path: string,
		expected: StorageItemType[],
		actual: StorageItemType,
	) {
		super(
			`Storage item type mismatch: ${path}, (${expected
				.map(a => STORAGE_ITEM_TYPE_NAMES[a])
				.join(", ")}) !== ${STORAGE_ITEM_TYPE_NAMES[actual]}`,
		);
	}
}

const assertType = (
	path: string,
	expected: StorageItemType[],
	actual: StorageItemType,
) => {
	if (!expected.includes(actual)) {
		throw new StorageItemTypeMismatchError(path, expected, actual);
	}
};

/* Indexed DB based file system */

const dbName = "kitl-idbfs";
const dbVersion = 1;
const dbStoreMeta = "meta";
const dbStoreData = "data";

/* Types */

export type StorageItemMeta = {
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

/*
type StorageItemData = {
	path: string;
	data: Uint8Array;
};
*/

// Async wrapper

const actions = ["get", "getAll", "put", "delete", "clear"];
const StoreW = (transaction: IDBTransaction, storeName: string): any =>
	Object.fromEntries(
		actions.map(name => [
			name,
			(...args: any) =>
				new Promise((resolve, reject) => {
					const req = (transaction.objectStore(storeName) as any)[
						name
					](...args);
					req.onsuccess = () => resolve(req.result);
					req.onerror = () => reject(req.error);
				}),
		]),
	);

const pPath = (path: string): [PathString, Path] => {
	// Check path is absolute and refine it
	const [p, chunks] = refinePath(path);
	if (!isAbsolutePath(chunks)) {
		throw new Error("Path must be absolute");
	}
	return [p, chunks];
};

// IDBFS class

type IDBFS = {
	readwrite: boolean;
	meta: any;
	data: any;
};

const shouldWritable = (fs: IDBFS) => {
	if (!fs.readwrite) {
		throw new Error(
			"Failed to process: IDBFS is created as readonly mode.",
		);
	}
};

export const getMeta = async (
	fs: IDBFS,
	path: string,
): Promise<StorageItemMeta> => {
	const [p] = pPath(path);
	try {
		return await fs.meta.get(p);
	} catch {
		return notFound;
	}
};

const rawWrite = async (
	fs: IDBFS,
	type: StorageItemType,
	path: string,
	data: Uint8Array,
): Promise<void> => {
	console.log("rawWrite", path, type, data.byteLength);
	await fs.meta.put({
		path,
		type: type,
		size: data.byteLength,
		lastModified: Date.now(),
	});
	// Write a file data
	await fs.data.put({
		path,
		data: data,
	});
};

/* Initialize */

export const format = async (fs: IDBFS) => {
	// Clear all data
	await fs.meta.clear();
	await fs.data.clear();
	// Write root directory
	await rawWrite(fs, StorageItemType.Directory, "/", str2arr(""));
};

/* File type */
export const getFileType = async (
	fs: IDBFS,
	path: string,
): Promise<StorageItemType> => {
	try {
		return (await getMeta(fs, path)).type;
	} catch {
		return StorageItemType.NotFound;
	}
};

/* Directory */

export const mkdir = async (fs: IDBFS, path: string): Promise<void> => {
	shouldWritable(fs);
	// Find the first existing parent directory
	const [, chunks] = pPath(path);
	let i = chunks.length;
	for (; i >= 1; --i) {
		const p = joinPath(chunks.slice(0, i));
		const t = await getFileType(fs, p);
		if (t === StorageItemType.Directory) {
			break;
		}
		assertType(p, [StorageItemType.NotFound], t);
	}
	// Read the parent directory
	const parent = joinPath(chunks.slice(0, i));
	const children = await getChildrenNames(fs, parent);
	children.push(chunks[i]);
	await rawWrite(
		fs,
		StorageItemType.Directory,
		parent,
		str2arr(children.join("\n")),
	);
	// Create directories
	for (++i; i <= chunks.length; ++i) {
		const path = joinPath(chunks.slice(0, i));
		// Write a directory meta
		const data = i < chunks.length ? str2arr(chunks[i]) : new Uint8Array(0);
		await rawWrite(fs, StorageItemType.Directory, path, data);
	}
};

export const getChildrenNames = async (
	fs: IDBFS,
	path: string,
): Promise<string[]> => {
	// Return all children names of directory
	const [p] = pPath(path);
	// Check if the path is a directory
	const r = await getMeta(fs, p);
	assertType(p, [StorageItemType.Directory], r.type);
	// List all files and directories
	const data = await fs.data.get(p);
	return ab2str(data.data)
		.split("\n")
		.map(s => s.trim())
		.filter(s => s.length > 0);
};

export const list = async (fs: IDBFS, path: string): Promise<StorageItem[]> => {
	const fileNames = await getChildrenNames(fs, path);
	const lst: StorageItem[] = [];
	for (const name of fileNames) {
		const [p] = refinePath(`${path}/${name}`);
		const meta = await getMeta(fs, p);
		lst.push({
			...meta,
			lastModified: new Date(meta.lastModified),
		});
	}
	return lst;
};

/* File */

const addChild = async (
	fs: IDBFS,
	path: string,
	name: string,
): Promise<void> => {
	const [p] = pPath(path);
	// Check if the path is a directory
	const r = await getMeta(fs, p);
	assertType(p, [StorageItemType.Directory], r.type);
	// Read the parent directory
	const children = new Set(await getChildrenNames(fs, p));
	children.add(name);
	await rawWrite(
		fs,
		StorageItemType.Directory,
		p,
		str2arr(Array.from(children).join("\n")),
	);
};

export const write = async (
	fs: IDBFS,
	path: string,
	content: Uint8Array,
): Promise<StorageItemMeta> => {
	// Find the first existing parent directory
	const [refinedPath, chunks] = pPath(path);
	// Check file exists
	const t = await getFileType(fs, path);
	assertType(path, [StorageItemType.File, StorageItemType.NotFound], t);
	if (t === StorageItemType.NotFound) {
		// Create new one
		await addChild(fs, path + "/..", chunks[chunks.length - 1]);
	}
	// Write a file meta
	await rawWrite(fs, StorageItemType.File, refinedPath, content);
	// Return new metadata
	return await getMeta(fs, path);
};

export const read = async (fs: IDBFS, path: string): Promise<Uint8Array> => {
	const [p] = pPath(path);
	// Check if the path is a file
	const t = await getFileType(fs, p);
	assertType(p, [StorageItemType.File], t);
	// Read a file data
	return (await fs.data.get(p)).data;
};

const getPrefixPaths = async (fs: IDBFS, path: string): Promise<string[]> => {
	const [p] = pPath(path),
		sub = p + "/",
		lst: StorageItem[] = await fs.meta.getAll();
	return lst.map(r => r.path).filter(p => p === path || p.startsWith(sub));
};

/* Remove */
export const remove = async (fs: IDBFS, path: string): Promise<void> => {
	const [p, chunks] = pPath(path);
	if (p.length <= 1) {
		// Format
		return await format(fs);
	}
	const parentPath = joinPath(chunks.slice(0, chunks.length - 1));
	const parent = await fs.meta.get(parentPath);
	assertType(p, [StorageItemType.Directory], parent.type);
	// Remove all children
	(await getPrefixPaths(fs, p)).forEach(p => {
		fs.meta.delete(p);
		fs.data.delete(p);
	});
	// Remove from parent
	const children = await getChildrenNames(fs, parentPath);
	await rawWrite(
		fs,
		StorageItemType.Directory,
		parentPath,
		str2arr(
			children.filter(c => c !== chunks[chunks.length - 1]).join("\n"),
		),
	);
};

/* File */
export const copy = async (
	fs: IDBFS,
	oldPath: string,
	newPath: string,
): Promise<void> => {
	const [op] = pPath(oldPath);
	const [np] = pPath(newPath);
	if (np === op || np.startsWith(op + "/")) {
		throw new Error("Cannot copy to a subdirectory");
	}
	// Get all paths to be moved
	const paths = (await getPrefixPaths(fs, op)).map(p => p.slice(op.length));
	// Move all paths
	for (const p of paths) {
		const src = op + p;
		const dst = np + p;
		const r = await fs.meta.get(src);
		const d = await fs.data.get(src);
		await rawWrite(fs, r.type, dst, d.data);
	}
	// Update parent directory
	if (newPath === "/") return;
	await addChild(fs, np + "/..", np.split("/").pop()!);
};

export const move = async (
	fs: IDBFS,
	oldPath: string,
	newPath: string,
): Promise<void> => {
	await copy(fs, oldPath, newPath);
	await remove(fs, oldPath);
};

const openDB = () =>
	new Promise<IDBDatabase>((resolve, reject) => {
		const req = indexedDB.open(dbName, dbVersion);
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
		req.onupgradeneeded = event => {
			const db = req.result,
				create = (name: string) =>
					db.createObjectStore(name, { keyPath: "path" });
			if (event.oldVersion === 0) {
				create(dbStoreMeta);
				create(dbStoreData);
				resolve(db);
			} else {
				reject(req.error);
			}
		};
	});

export const openfs = async (readwrite?: boolean): Promise<IDBFS> => {
	const transaction = await (
		await openDB()
	).transaction(
		[dbStoreMeta, dbStoreData],
		readwrite ? "readwrite" : "readonly",
	);
	return {
		readwrite: !!readwrite,
		meta: StoreW(transaction, dbStoreMeta),
		data: StoreW(transaction, dbStoreData),
	};
};

export const checkfs = async () => {
	// Open fs and if it fails, format it
	const fs = await openfs(true);
	try {
		const type = await getFileType(fs, "/");
		assertType("/", [StorageItemType.Directory], type);
	} catch {
		console.warn("IDBFS is broken. Format it.");
		await format(fs);
	}
};

checkfs();
