import { extractFilename, newRoot, splitHostPath, str2arr } from "@/common";
import { IClient } from "./i-client";
import LocalClient from "./local-client";
import { StorageItem, StorageItemType } from "./storage";

export default class Clients {
	local: LocalClient;
	clients: Map<string, IClient>;

	constructor() {
		this.local = new LocalClient();
		this.clients = new Map<string, IClient>();
		this.addClient("local", this.local);
	}

	async addClient(name: string, client: IClient) {
		this.clients.set(name, client);
		// Initialize client
		// If .kitl does not exist, create it
		const stat = await client.stat("/.kitl");
		if (stat.type !== StorageItemType.Directory) {
			await client.remove("/.kitl");
			await client.mkdir("/.kitl");
		}
		// If .kitl/scratch.kitl does not exist, create it
		const stat2 = await client.stat("/.kitl/scratch.kitl");
		if (stat2.type !== StorageItemType.File) {
			await client.remove("/.kitl/scratch.kitl");
			await client.write(
				"/.kitl/scratch.kitl",
				str2arr(JSON.stringify(newRoot({}))),
			);
		}
	}

	// Helper

	parsePath(path: string): [IClient, string] {
		// Take path and return client and path
		const [host, path2] = splitHostPath(path);
		return [this.clients.get(host)!, path2];
	}

	// Files

	async stat(path: string): Promise<StorageItem> {
		const [client, path2] = this.parsePath(path);
		return await client.stat(path2);
	}

	async list(path: string): Promise<StorageItem[]> {
		const [client, path2] = this.parsePath(path);
		return await client.list(path2);
	}

	async mkdir(path: string): Promise<void> {
		const [client, path2] = this.parsePath(path);
		return await client.mkdir(path2);
	}

	async read(path: string): Promise<Uint8Array> {
		const [client, path2] = this.parsePath(path);
		return await client.read(path2);
	}

	async write(path: string, data: Uint8Array): Promise<StorageItem> {
		const [client, path2] = this.parsePath(path);
		return await client.write(path2, data);
	}

	async remove(path: string): Promise<void> {
		const [client, path2] = this.parsePath(path);
		return await client.remove(path2);
	}

	async copy(path: string, newPath: string): Promise<void> {
		const [client, path2] = this.parsePath(path);
		const [newClient, newPath2] = this.parsePath(newPath);
		if (client === newClient) {
			return await client.copy(path2, newPath2);
		}
		// Recursively copy
		// First get file type
		const stat = await client.stat(path2);
		switch (stat.type) {
			case StorageItemType.Directory:
				{
					await newClient.mkdir(newPath2);
					const list = await client.list(path2);
					for (const item of list) {
						const name = extractFilename(item.path);
						await this.copy(
							`${path}/${name}`,
							`${newPath}/${name}`,
						);
					}
				}
				break;
			default: {
				// Just read and write
				const data = await client.read(path2);
				await newClient.write(newPath2, data);
			}
		}
	}

	async move(path: string, newPath: string): Promise<void> {
		const [client, path2] = this.parsePath(path);
		const [newClient, newPath2] = this.parsePath(newPath);
		if (client === newClient) {
			return await client.move(path2, newPath2);
		} else {
			this.copy(path, newPath);
			// Now delete
			await client.remove(path2);
		}
	}

	async readJson(path: string, jsonPath: string[]): Promise<any> {
		const [client, path2] = this.parsePath(path);
		return await client.readJson(path2, jsonPath);
	}

	async writeJson(
		path: string,
		jsonPath: string[],
		data: any,
	): Promise<StorageItem> {
		const [client, path2] = this.parsePath(path);
		return await client.writeJson(path2, jsonPath, data);
	}
}

export const clients = new Clients();
