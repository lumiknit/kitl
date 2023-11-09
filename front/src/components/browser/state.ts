import { clients } from "@/client/clients";
import { StorageItem, StorageItemNotFound } from "@/client/storage";
import { VWrap, refineHostPath } from "@/common";
import { batch, createSignal } from "solid-js";

const LARGE_SIZE = 1024 * 128;

export type State = {
	path: VWrap<string>;
	storageItem: VWrap<StorageItem | undefined>;
	data: VWrap<ArrayBuffer | undefined>;

	uploads: VWrap<Set<string>>;

	// Actions
	onOpenVal?: (path: string, name: string) => void;
	onClose?: () => void;
};

export const newState = (path: string): State => ({
	path: createSignal<string>(path),
	storageItem: createSignal<StorageItem>(),
	data: createSignal<ArrayBuffer>(),
	uploads: createSignal(new Set<string>(), { equals: false }),
});

export const loadMeta = async (state: State) => {
	const path = state.path[0];
	const storageItem = await clients.stat(path());
	state.storageItem[1](storageItem);
};

export const loadData = async (state: State) => {
	const path = state.path[0];
	const data = await clients.read(path());
	state.data[1](data);
};

export const cd = (state: State, path: string) => {
	const [host, refinedPath] = refineHostPath(path);
	path = `${host}:${refinedPath}`;
	batch(() => {
		state.path[1](path);
		state.storageItem[1](undefined);
		state.data[1](undefined);
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

export const isFileLarge = (state: State) => {
	const storageItem = state.storageItem[0]();
	return storageItem && storageItem.size > LARGE_SIZE;
};

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
				state.uploads[1](s => {
					s.delete(path);
					cd(state, state.path[0]());
					return s;
				});
			})
			.catch(() => {
				state.uploads[1](s => {
					s.delete(path);
					return s;
				});
				alert("Failed to upload file: " + path + "");
			});
	};
	reader.onerror = () => {
		state.uploads[1](s => {
			s.delete(path);
			return s;
		});
		alert("Failed to read file: " + path + "");
	};
	reader.readAsArrayBuffer(file);
};
