import {
	Node,
	Edge,
} from './data';

export type HrmActions = {
	// Getters
	getNodes: () => Node[];
	getEdges: () => Edge[];

	// Selection
	selectAll: () => void;
	deselectAll: () => void;

	translateSelectedNodes: (id: string, dx: number, dy: number) => void;
	selectNodeOne: (id: string) => void;
};