import { IStorageClient } from "./storage";

export interface IConnection {
	// ping: return the ping time in milliseconds. If not connected, return undefined.
	ping(): number | undefined;
}

export type ExecutionID = string;
export interface ILaunch {
	// execute: launch a new execution. Return the execution ID.
	execute(path: string): ExecutionID;
	// getExecutionState: return the state of the execution with the given ID.
	getExecutionState(id: ExecutionID): any;
}

export interface IClient extends IConnection, ILaunch, IStorageClient {}
