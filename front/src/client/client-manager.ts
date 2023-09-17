// Client manager

import LocalClient from "./local-client";
import { IClient } from "./client";
import { StorageItemType, StorageItem } from "./storage";

export class Location {
  host: string;
  path: string;

  constructor(host: string, path: string) {
    this.host = host;
    this.path = path;
  }

  toString(): string {
    return `${this.host}:${this.path}`;
  }
}

export class ClientManager {
  defaultClient: string;
  clients: Map<string, IClient>;

  constructor() {
    this.defaultClient = "local";
    this.clients = new Map<string, IClient>();
    this.clients.set("local", new LocalClient());
  }

  // Main helpers

  parsePath(path: string): Location {
    let host = this.defaultClient;
    const idx = path.indexOf(":");
    if (idx >= 0) {
      host = path.slice(0, idx);
      path = path.slice(idx + 1);
    }
    return new Location(host, path);
  }

  clientList(): string[] {
    return Array.from(this.clients.keys());
  }

  client(name: string): IClient {
    const c = this.clients.get(name);
    if (!c) {
      throw new Error(`Client ${name} not found`);
    }
    return c;
  }

  // Storage
  getFileType(path: string): Promise<StorageItemType> {
    const { host, path: p } = this.parsePath(path);
    return this.client(host).getFileType(p);
  }

  mkdir(path: string): Promise<void> {
    const { host, path: p } = this.parsePath(path);
    return this.client(host).mkdir(p);
  }

  list(path: string): Promise<StorageItem[]> {
    const { host, path: p } = this.parsePath(path);
    return this.client(host).list(p);
  }

  read(path: string): Promise<string> {
    const { host, path: p } = this.parsePath(path);
    return this.client(host).read(p);
  }

  write(path: string, content: string): Promise<void> {
    const { host, path: p } = this.parsePath(path);
    return this.client(host).write(p, content);
  }

  remove(path: string): Promise<void> {
    const { host, path: p } = this.parsePath(path);
    return this.client(host).remove(p);
  }

  async copy(path: string, newPath: string): Promise<void> {
    const { host, path: p } = this.parsePath(path);
    const { host: newhost, path: newP } = this.parsePath(newPath);
    if (host !== newhost) {
      const data = await this.client(host).read(p);
      return await this.client(newhost).write(newP, data);
    } else {
      return this.client(host).copy(p, newP);
    }
  }

  async move(path: string, newPath: string): Promise<void> {
    const { host, path: p } = this.parsePath(path);
    const { host: newhost, path: newP } = this.parsePath(newPath);
    if (host !== newhost) {
      const data = await this.client(host).read(p);
      await this.client(newhost).write(newP, data);
      return await this.client(host).remove(p);
    } else {
      return await this.client(host).move(p, newP);
    }
  }

  // Executors
}

export default new ClientManager();
