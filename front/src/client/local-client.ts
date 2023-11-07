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
		return await (await idbfs.openfs(true)).format();
	}

	async stat(path: string): Promise<StorageItem> {
		const fs = await idbfs.openfs(false);
		const meta = await fs.getMeta(path);
		return {
			...meta,
			lastModified: new Date(meta.lastModified),
		};
	}

	async mkdir(path: string): Promise<void> {
		const fs = await idbfs.openfs(true);
		await fs.mkdir(path);
	}

	async list(path: string): Promise<StorageItem[]> {
		const fs = await idbfs.openfs(false);
		const items = await fs.list(path);
		return items.map(item => ({
			...item,
			lastModified: new Date(item.lastModified),
		}));
	}

	async read(path: string): Promise<Uint8Array> {
		const fs = await idbfs.openfs(false);
		return await fs.read(path);
	}

	async write(path: string, data: Uint8Array): Promise<void> {
		const fs = await idbfs.openfs(true);
		await fs.write(path, data);
	}

	async remove(path: string): Promise<void> {
		const fs = await idbfs.openfs(true);
		await fs.remove(path);
	}

	async move(from: string, to: string): Promise<void> {
		const fs = await idbfs.openfs(true);
		await fs.move(from, to);
	}

	async copy(from: string, to: string): Promise<void> {
		const fs = await idbfs.openfs(true);
		await fs.copy(from, to);
	}
}
