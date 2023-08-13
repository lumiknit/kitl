// Dummy local client

import { IClient } from "./client";
import * as t from "./storage";

export class LocalClient implements IClient {
  isConnected(): boolean {
    return true;
  }

  getFileType(): Promise<t.StorageItemType> {
    throw new Error("Method not implemented.");
  }

  list(): Promise<t.FileMeta[]> {
    throw new Error("Method not implemented.");
  }

  read(): Promise<string> {
    throw new Error("Method not implemented.");
  }

  write(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  delete(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  mkdir(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  rename(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  execute(): Promise<string> {
    throw new Error("Method not implemented.");
  }

  getExecutionStatus(): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
