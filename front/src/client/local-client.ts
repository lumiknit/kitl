// Dummy local client

import { IClient } from "./client";
import * as t from "./storage";
import * as idbfs from "./idbfs";

export class LocalClient implements IClient {
  fs: idbfs.IDBFS;

  constructor() {
    this.fs = new idbfs.IDBFS();
  }

  isConnected(): boolean {
    return true;
  }

  /* IStorageClient */

  async getFileType(path: string): Promise<t.StorageItemType> {
    return await this.fs.getFileType(path);
  }

  async mkdir(path: string): Promise<void> {
    return await this.fs.mkdir(path);
  }

  async list(path: string): Promise<t.StorageItem[]> {
    return await this.fs.list(path);
  }

  async read(path: string): Promise<string> {
    return await this.fs.read(path);
  }

  async write(path: string, content: string): Promise<void> {
    return await this.fs.write(path, content);
  }

  async remove(path: string): Promise<void> {
    return await this.fs.remove(path);
  }

  async copy(path: string, newPath: string): Promise<void> {
    return await this.fs.copy(path, newPath);
  }

  async move(path: string, newPath: string): Promise<void> {
    return await this.fs.move(path, newPath);
  }

  /* Executor */

  execute(): Promise<string> {
    throw new Error("Method not implemented.");
  }

  getExecutionStatus(): Promise<any> {
    throw new Error("Method not implemented.");
  }
}

export default LocalClient;
