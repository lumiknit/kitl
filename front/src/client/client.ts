import * as storage from "./storage";
import * as executor from "./executor";

export interface IConnection {
  isConnected(): boolean;
}

export interface IClient
  extends IConnection,
    storage.IStorageClient,
    executor.IExecutor {}
