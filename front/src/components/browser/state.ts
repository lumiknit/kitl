import { StorageItem } from "@/client/storage";
import { VBox, VWrap } from "@/common";
import { createSignal } from "solid-js";


export type State = {
	path: VWrap<string>;
	storageItem: VWrap<StorageItem | undefined>;

	// Actions
	onOpenVal?: (path: string, name: string) => void;
	onClose?: () => void;
};

export const newState = (path: string): State => ({
	path: createSignal(path),
	storageItem: createSignal<StorageItem>(),
});

export const 
