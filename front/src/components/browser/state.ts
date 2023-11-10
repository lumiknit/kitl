import { ToastType, toast } from "@/block/ToastContainer";
import { clients } from "@/client/clients";
import {
	StorageItem,
	StorageItemNotFound,
	StorageItemType,
} from "@/client/storage";
import { VWrap, refineHostPath } from "@/common";
import { s } from "@/locales";
import { batch, createSignal } from "solid-js";

const LARGE_SIZE = 1024 * 128; // 128 KB

export type SelectableStorageItem = StorageItem & {
	selected?: boolean;
};

export type CopyState = {
	items: string[];
	isCutted: boolean;
};

const emptyCopyState = (): CopyState => ({
	items: [],
	isCutted: false,
});

export type State = {
	path: VWrap<string>;
	storageItem: VWrap<StorageItem | undefined>;
	data: VWrap<ArrayBuffer | undefined>;
	ls: VWrap<SelectableStorageItem[] | undefined>;

	// Copied
	copyState: VWrap<CopyState>;

	uploads: VWrap<Set<string>>;

	// Actions
	onOpenVal?: (path: string, name: string) => void;
	onClose?: () => void;
};

export type StateWrap = {
	// For props
	state: State;
};

export const newState = (path: string): State => ({
	path: createSignal<string>(path),
	storageItem: createSignal<StorageItem>(),
	data: createSignal<ArrayBuffer>(),
	ls: createSignal<StorageItem[]>(),
	copyState: createSignal<CopyState>(emptyCopyState()),
	uploads: createSignal(new Set<string>(), { equals: false }),
});

export const resetLocal = (state: State) => {
	if (confirm(s("fileBrowser.prompt.resetLocal"))) {
		clients.local.format();
		cd(state, "local:/");
	}
};

export const loadMeta = async (state: State) => {
	const path = state.path[0];
	const storageItem = await clients.stat(path());
	state.storageItem[1](storageItem);
};

export const loadData = async (state: State) => {
	const path = state.path[0];
	const item = state.storageItem[0]();
	if (item?.type === StorageItemType.Directory) {
		const loaded = await clients.list(path());
		loaded.sort((a, b) => {
			if (a.type === b.type) {
				return a.path.localeCompare(b.path);
			} else {
				return a.type === StorageItemType.Directory ? -1 : 1;
			}
		});
		batch(() => {
			state.ls[1](loaded);
			state.data[1](new Uint8Array());
		});
		return;
	}
	const data = await clients.read(path());
	batch(() => {
		state.data[1](data);
		state.ls[1]([]);
	});
};

export const cd = (state: State, path: string) => {
	const [host, refinedPath] = refineHostPath(path);
	path = `${host}:${refinedPath}`;
	batch(() => {
		state.path[1](path);
		state.storageItem[1](undefined);
		state.data[1](undefined);
		state.ls[1](undefined);
	});
	// Run load in the background
	loadMeta(state).catch(() => {
		console.warn("Failed to load meta ", path);
		state.storageItem[1](StorageItemNotFound);
	});
};

export const cdParent = (state: State) => {
	const path = state.path[0]();
	cd(state, path + "/..");
};

export const reload = (state: State) => {
	const path = state.path[0]();
	cd(state, path);
};

export const isFileLarge = (state: State) => {
	const storageItem = state.storageItem[0]();
	return storageItem && storageItem.size > LARGE_SIZE;
};

// File Creations

export const newFolder = async (state: State, name: string) => {
	const path = state.path[0];
	await clients.mkdir(path() + "/" + name);
};

export const newFile = async (state: State, name: string) => {
	const path = state.path[0];
	await clients.write(path() + "/" + name, new Uint8Array());
};

export const uploadFile = (state: State, path: string, file: File) => {
	state.uploads[1](s => s.add(path));
	const reader = new FileReader();
	reader.onload = () => {
		clients
			.write(path, new Uint8Array(reader.result as ArrayBuffer))
			.then(() => {
				state.uploads[1](set => {
					set.delete(path);
					cd(state, state.path[0]());
					toast(`${s("fileBrowser.toast.uploadSuccess")}: ${path}`, {
						type: ToastType.Success,
					});
					return set;
				});
			})
			.catch(() => {
				state.uploads[1](set => {
					set.delete(path);
					return set;
				});
				toast(`${s("fileBrowser.toast.uploadError")}: ${path}`, {
					type: ToastType.Error,
				});
			});
	};
	reader.onerror = () => {
		state.uploads[1](s => {
			s.delete(path);
			return s;
		});
		alert(`${s("fileBrowser.toast.uploadReadError")}: ${path}`);
	};
	reader.readAsArrayBuffer(file);
};

// File Selections

export const setFileSelected = (
	state: State,
	filename: string,
	value?: boolean,
) => {
	state.ls[1](ls => {
		if (!ls) return ls;
		return ls.map(item => {
			if (item.path === filename) {
				item.selected = value;
			}
			return item;
		});
	});
};

export const getSelectedFiles = (state: State): string[] => {
	const host = state.path[0]().split(":")[0];
	const ls = state.ls[0]();
	if (!ls) return [];
	return ls.filter(item => item.selected).map(item => `${host}:${item.path}`);
};

// File operations

export class NothingSelectedError extends Error {
	constructor() {
		super("Nothing selected");
	}
}

export const copySelectedFiles = (state: State) => {
	const selected = getSelectedFiles(state);
	if (selected.length === 0) {
		throw new NothingSelectedError();
	}
	state.copyState[1]({
		items: getSelectedFiles(state),
		isCutted: false,
	});
};

export const cutSelectedFiles = (state: State) => {
	const selected = getSelectedFiles(state);
	if (selected.length === 0) {
		throw new NothingSelectedError();
	}
	state.copyState[1]({
		items: getSelectedFiles(state),
		isCutted: true,
	});
};

export const pasteFiles = async (state: State) => {
	const path = state.path[0];
	const storageItem = state.storageItem[0]();
	if (!storageItem) {
		return;
	}
	const dest = path();
	const copyState = state.copyState[0]();
	for (const src of copyState.items) {
		const destPath = dest + "/" + src.split("/").pop();
		console.log("Paste", src, destPath);
		if (copyState.isCutted) {
			await clients.move(src, destPath);
		} else {
			await clients.copy(src, destPath);
		}
	}
	if (copyState.isCutted) {
		// Reset state
		state.copyState[1](emptyCopyState());
	}
};

export const deleteSelectedFiles = async (state: State) => {
	if (!confirm(s("fileBrowser.prompt.deleteSelected"))) return;
	for (const path of getSelectedFiles(state)) {
		await clients.remove(path);
	}
};

// Modify Files

export const renameFile = async (path: string, newName: string) => {
	// Use move to rename
	await clients.move(path, path + "/../" + newName);
};

export const renameSelectedFiles = async (state: State) => {
	const selected = getSelectedFiles(state);
	if (selected.length < 1) {
		throw new NothingSelectedError();
	}
	for (const path of selected) {
		const name = path.split("/").pop();
		if (!name) return;
		const p = `${s("fileBrowser.prompt.renameSelected")}:\n${path}`;
		const newName = prompt(p, name);
		if (!newName) return;
		await renameFile(path, newName);
	}
	reload(state);
};

export const saveFile = async (state: State, contents: string) => {
	// Check stat
	const path = state.path[0]();
	const oldMeta = state.storageItem[0]();
	if (!oldMeta) return;
	const currentMeta = await clients.stat(path);
	if (!currentMeta) return;
	if (
		oldMeta.lastModified < currentMeta.lastModified ||
		oldMeta.lastModified > currentMeta.lastModified ||
		oldMeta.size !== currentMeta.size
	) {
		if (!confirm(s("fileBrowser.prompt.saveConflict"))) return;
	}
	// Save
	await clients.write(path, new TextEncoder().encode(contents));
	// Update state
	state.storageItem[1](await clients.stat(path));
	toast(s("fileBrowser.toast.saved"), { type: ToastType.Success });
};
