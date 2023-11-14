import { JsonKey } from "@/common";
import { IClient } from "./i-client";
import * as idbfs from "./idbfs";
import { StorageItem } from "./storage";

const metaToItem = (meta: idbfs.StorageItemMeta): StorageItem => ({
	...meta,
	lastModified: new Date(meta.lastModified),
});

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
		return metaToItem(await idbfs.getMeta(fs, path));
	}

	async mkdir(path: string): Promise<void> {
		const fs = await idbfs.openfs(true);
		await idbfs.mkdir(fs, path);
	}

	async list(path: string): Promise<StorageItem[]> {
		const fs = await idbfs.openfs(false);
		return await idbfs.list(fs, path);
	}

	async read(path: string): Promise<Uint8Array> {
		const fs = await idbfs.openfs(false);
		return await idbfs.read(fs, path);
	}

	async write(path: string, data: Uint8Array): Promise<StorageItem> {
		const fs = await idbfs.openfs(true);
		return metaToItem(await idbfs.write(fs, path, data));
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

	async readJson(path: string, jsonPath: JsonKey[]): Promise<any> {
		const fs = await idbfs.openfs(false);
		const contents = await idbfs.read(fs, path);
		// Parse
		const data = JSON.parse(new TextDecoder().decode(contents));
		// Get json path
		let current = data;
		for (const key of jsonPath) {
			current = current[key];
		}
		return current;
	}

	async writeJson(
		path: string,
		jsonPath: JsonKey[],
		data: any,
	): Promise<StorageItem> {
		let item;
		const fs = await idbfs.openfs(true),
			l = jsonPath.length;
		if (l === 0) {
			item = await idbfs.write(
				fs,
				path,
				new TextEncoder().encode(JSON.stringify(data)),
			);
		} else {
			// Read from file
			const contents = await idbfs.read(fs, path);
			// Parse
			const parsed = JSON.parse(new TextDecoder().decode(contents));
			let cur = parsed;
			for (let i = 0; i < l - 1; i++) {
				cur = cur[jsonPath[i]];
			}
			// Update
			cur[jsonPath[l - 1]] = data;
			// Write to file
			item = await idbfs.write(
				fs,
				path,
				new TextEncoder().encode(JSON.stringify(parsed)),
			);
		}
		return metaToItem(item!);
	}
}
