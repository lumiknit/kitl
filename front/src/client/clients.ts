import { splitHostPath } from "@/common";
import { IClient } from "./i-client";
import LocalClient from "./local-client";
import { StorageItem } from "./storage";

export default class Clients {
	local: LocalClient;
	clients: Map<string, IClient>;

	constructor() {
		this.local = new LocalClient();
		this.clients = new Map<string, IClient>([
			["local", this.local as IClient],
		]);
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
		console.log("list", path2);
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

	async write(path: string, data: Uint8Array): Promise<void> {
		const [client, path2] = this.parsePath(path);
		return await client.write(path2, data);
	}
}

export const clients = new Clients();
