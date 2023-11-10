import { IClient } from "./i-client";
import * as idbfs from "./idbfs";
import { StorageItem } from "./storage";

export default class LocalClient implements IClient {
	constructor() {
		idbfs.checkfs();
	}

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

	async format(): Promise<void> {
		const fs = await idbfs.openfs(true);
		return await idbfs.format(fs);
	}

	async stat(path: string): Promise<StorageItem> {
		const fs = await idbfs.openfs(false);
		const meta = await idbfs.getMeta(fs, path);
		return {
			...meta,
			lastModified: new Date(meta.lastModified),
		};
	}

	async mkdir(path: string): Promise<void> {
		const fs = await idbfs.openfs(true);
		await idbfs.mkdir(fs, path);
	}

	async list(path: string): Promise<StorageItem[]> {
		const fs = await idbfs.openfs(false);
		const items = await idbfs.list(fs, path);
		return items.map(item => ({
			...item,
			lastModified: new Date(item.lastModified),
		}));
	}

	async read(path: string): Promise<Uint8Array> {
		const fs = await idbfs.openfs(false);
		return await idbfs.read(fs, path);
	}

	async write(path: string, data: Uint8Array): Promise<void> {
		const fs = await idbfs.openfs(true);
		await idbfs.write(fs, path, data);
	}

	async remove(path: string): Promise<void> {
		const fs = await idbfs.openfs(true);
		await idbfs.remove(fs, path);
	}

	async move(from: string, to: string): Promise<void> {
		const fs = await idbfs.openfs(true);
		await idbfs.move(fs, from, to);
	}

	async copy(from: string, to: string): Promise<void> {
		const fs = await idbfs.openfs(true);
		await idbfs.copy(fs, from, to);
	}
}
