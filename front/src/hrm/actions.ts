import { Node } from "./data";

export type HrmActions = {
	// Getters
	getNodes: () => Node[];
	getNode: (id: string) => Node | undefined;

	// Selection
	selectAll: () => void;
	deselectAll: () => void;

	translateSelectedNodes: (id: string, dx: number, dy: number) => void;
	selectNodeOne: (id: string) => void;
};
