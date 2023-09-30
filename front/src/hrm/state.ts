import { batch, createSignal, untrack } from "solid-js";
import {
	NodeID,
	Nodes as CNodes,
	VWrap,
	Rect,
	HandleID,
	Position,
} from "@/common";
import { Handle, HandleType, Nodes, Transform, thawNodes } from "./data";

export type EditingEdge = {
	sinkID?: NodeID;
	sinkHandle?: HandleID;
	srcID?: NodeID;
	srcHandle?: HandleID;
	end: Position;
};

export class State {
	rootRef?: HTMLDivElement;
	viewRef?: HTMLDivElement;

	editingEdge: EditingEdge = {
		end: { x: 0, y: 0 },
	};

	nodes: () => Nodes;
	update: (a: Nodes | ((ns: Nodes) => Nodes)) => void;

	transform: VWrap<Transform> = [() => ({ x: 0, y: 0, z: 0 }), () => {}];

	constructor(initialNodes: CNodes) {
		const [nodes, setNodes] = createSignal<Nodes>(thawNodes(initialNodes));
		this.nodes = nodes;
		this.update = setNodes;
	}

	viewRect(elem: HTMLElement): Rect | undefined {
		if (this.viewRef === undefined) return;
		const rootRect = this.viewRef!.getBoundingClientRect();
		const rect = elem.getBoundingClientRect();
		const t = untrack(this.transform[0]);
		return {
			x: (rect.left - rootRect.left) / t.z,
			y: (rect.top - rootRect.top) / t.z,
			w: rect.width / t.z,
			h: rect.height / t.z,
		};
	}

	translateSelectedNodes(id: NodeID, dx: number, dy: number, zoom: number) {
		for (const [nid, node] of this.nodes()) {
			node[1](n => {
				if (nid !== id && !n.selected) return n;
				return {
					...n,
					position: {
						x: n.position.x + dx / zoom,
						y: n.position.y + dy / zoom,
					},
				};
			});
		}
	}

	selectAll() {
		for (const [_, node] of this.nodes()) {
			node[1](n => {
				return {
					...n,
					selected: true,
				};
			});
		}
	}

	deselectAll() {
		for (const [_, node] of this.nodes()) {
			node[1](n => {
				return {
					...n,
					selected: false,
				};
			});
		}
	}

	toggleNodeOne(id: NodeID) {
		// Check is selected
		for (const [nid, node] of this.nodes()) {
			if (nid !== id) {
				node[1](n =>
					n.selected
						? {
								...n,
								selected: false,
						  }
						: n,
				);
			} else {
				node[1](n => ({
					...n,
					selected: !n.selected,
				}));
			}
		}
	}

	// Edit

	setEdge(
		sinkID: NodeID,
		sinkHandle: HandleID,
		srcID: NodeID,
		srcHandle?: HandleID,
	) {
		console.log("setEdge", sinkID, sinkHandle, srcID, srcHandle);
		const nodes = this.nodes(),
			node = nodes.get(sinkID);
		if (!node) return;
		const [n] = node,
			h = n().handles[sinkHandle];
		h[1](h =>
			h.data.type !== HandleType.Sink
				? h
				: {
						...h,
						data: {
							type: HandleType.Sink,
							sourceID: srcID,
							sourceHandle: srcHandle,
						},
				  },
		);
	}

	deleteEdge(id: NodeID, handle: HandleID) {
		console.log("deleteEdge", id, handle);
		const nodes = this.nodes(),
			node = nodes.get(id);
		if (!node) return;
		const [n] = node,
			h = n().handles[handle];
		h[1](h =>
			h.data.type !== HandleType.Sink
				? h
				: {
						...h,
						data: { type: HandleType.Sink },
				  },
		);
	}

	editEdgeSource(id: NodeID, handle?: HandleID) {
		console.log("editEdgeSource", id, handle);
		if (this.editingEdge.sinkID !== undefined) {
			this.setEdge(
				this.editingEdge.sinkID,
				this.editingEdge.sinkHandle!,
				id,
				handle,
			);
			this.editingEdge = {
				end: { x: 0, y: 0 },
			};
		} else {
			this.editingEdge.srcID = id;
			this.editingEdge.srcHandle = handle;
		}
	}

	editEdgeSink(id: NodeID, handle: HandleID) {
		console.log("editEdgeSink", id, handle);
		if (this.editingEdge.srcID !== undefined) {
			this.setEdge(
				id,
				handle,
				this.editingEdge.srcID,
				this.editingEdge.srcHandle,
			);
			this.editingEdge = {
				end: { x: 0, y: 0 },
			};
		} else {
			this.editingEdge.sinkID = id;
			this.editingEdge.sinkHandle = handle;
		}
	}

	editEdge(id: NodeID, handle?: HandleID) {
		// Add to editing edge, and add edge when it completed
		// Find the node
		const nodes = this.nodes();
		const node = nodes.get(id);
		if (!node) return;
		const [n] = node;
		if (handle === undefined) return this.editEdgeSource(id);
		// Find the handle
		const h = n().handles[handle];
		if (h === undefined) return;
		// Check if it is a source
		if (h[0]().data.type === HandleType.Source)
			return this.editEdgeSource(id, handle);
		else return this.editEdgeSink(id, handle);
	}
}
