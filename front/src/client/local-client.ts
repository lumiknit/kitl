import {IClient} from './i-client';
import { FileMeta } from './i-file';

export default class LocalClient implements IClient {
	ping(): number {
		return 1;
	}
	
	execute(path: string): string {
		return "";
	}
	
	getExecutionState(id: string): any {
		return {};
	}

	stat(path: string): FileMeta {
		return {
			type: 0,
			name: "",
			lastModified: new Date(),
		};
	}
	
	mkdir(path: string): void {
	}
	
	list(path: string): string[] {
		return [];
	}
	
	getMeta(path: string): any {
		return {};
	}
	
	read(path: string): Uint8Array {
		return new Uint8Array();
	}
	
	write(path: string, data: Uint8Array): void {
	}
	
	remove(path: string): void {
	}
	
	move(from: string, to: string): void {
	}
	
	copy(from: string, to: string): void {
	}
}