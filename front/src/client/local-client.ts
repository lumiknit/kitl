import { IClient } from "./i-client";
import * as idbfs from "./idbfs";
import { StorageItem } from "./storage";

export default class LocalClient implements IClient {
	ping(): number {
		return 1;
	}

	execute(path: string): string {
		path;
		return "";
	}

	getExecutionState(id: string): any {
		id;
		return {};
	}

	async stat(path: string): Promise<StorageItem> {
		path;
		idbfs;
		return {
			type: 0,
			path: "",
			size: 0,
			lastModified: new Date(),
		};
	}

	async mkdir(path: string): Promise<void> {
		path;
	}

	async list(path: string): Promise<StorageItem[]> {
		path;
		return [];
	}

	async getMeta(path: string): Promise<any> {
		path;
		return {};
	}

	async read(path: string): Promise<Uint8Array> {
		path;
		return new Uint8Array();
	}

	async write(path: string, data: Uint8Array): Promise<void> {
		path;
		data;
	}

	async remove(path: string): Promise<void> {
		path;
	}

	async move(from: string, to: string): Promise<void> {
		from;
		to;
	}

	async copy(from: string, to: string): Promise<void> {
		from;
		to;
	}
}
