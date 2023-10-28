import { IClient } from "./i-client";
import LocalClient from "./local-client";

export default class Clients {
	clients: Map<string, IClient>;

	constructor() {
		this.clients = new Map<string, IClient>([
			["local", new LocalClient() as IClient],
		]);
	}
}
