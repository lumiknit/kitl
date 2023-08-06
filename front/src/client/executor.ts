export type ExecutionStatus {

}

export interface IExecutor {
  execute(path: string, fn: string): Promise<string>;
  getExecutionStatus(id: string): Promise<ExecutionStatus>;
}
