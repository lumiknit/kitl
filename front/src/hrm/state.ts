import { createSignal, untrack } from "solid-js";
import {
	NodeID,
	Nodes as CNodes,
	VWrap,
	Rect,
	HandleID,
	Position,
	origin,
	ROOT_NODES,
} from "@/common";
import {
	EditingEdge,
	HandleType,
	Nodes,
	Transform,
	freezeNodes,
	thawNodes,
} from "./data";

/* State */

export class State {
	rootRef?: HTMLDivElement;
	viewRef?: HTMLDivElement;

	editingEdge: VWrap<EditingEdge>;

	nodes: () => Nodes;
	setNodes: (a: Nodes | ((ns: Nodes) => Nodes)) => void;

	transform: VWrap<Transform>;

	history: CNodes[];
	historyIndex: number;

	constructor(initialNodes: CNodes) {
		const [nodes, setNodes] = createSignal<Nodes>(thawNodes(initialNodes));
		this.nodes = nodes;
		this.setNodes = setNodes;
		this.editingEdge = createSignal({ end: origin });
		this.transform = [() => ({ x: 0, y: 0, z: 1 }), () => {}];
		// History
		this.history = [initialNodes];
		this.historyIndex = 0;
	}

	// Graph save/load

	thaw(frozen: CNodes) {
		this.setNodes(thawNodes(frozen));
		this.history = [frozen];
		this.historyIndex = 0;
	}

	freeze(): CNodes {
		return freezeNodes(this.nodes());
	}

	// History

	saveHistory() {
		this.historyIndex++;
		if (this.history.length > this.historyIndex) {
			this.history = this.history.slice(0, this.historyIndex);
		}
		this.history.push(this.freeze());
	}

	undo() {
		if (this.historyIndex > 0) {
			this.historyIndex--;
			this.thaw(this.history[this.historyIndex]);
		}
	}

	redo() {
		if (this.historyIndex < this.history.length - 1) {
			this.historyIndex++;
			this.thaw(this.history[this.historyIndex]);
		}
	}

	// View & Transforms

	viewPos(x: number, y: number): Position | undefined {
		if (!this.viewRef) return;
		const rootRect = this.viewRef!.getBoundingClientRect();
		const t = untrack(this.transform[0]);
		return {
			x: (x - rootRect.left) / t.z,
			y: (y - rootRect.top) / t.z,
		};
	}

	viewRect(elem?: HTMLElement): Rect | undefined {
		if (!elem || !this.viewRef) return;
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

	// Node / Handle Getter

	ref(id: NodeID, handle?: HandleID) {
		const node = this.nodes().get(id);
		if (!node) return;
		const n = node[0]();
		if (handle === undefined) return n.ref;
		const h = n.handles[handle];
		if (!h) return;
		return h[0]().ref;
	}

	viewRectOf(id: NodeID, handle?: HandleID): Rect | undefined {
		return this.viewRect(this.ref(id, handle));
	}

	// Selected Nodes

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
		for (const [, node] of this.nodes()) {
			node[1](n => (n.selected ? n : { ...n, selected: true }));
		}
	}

	deselectAll() {
		for (const [, node] of this.nodes()) {
			node[1](n => (n.selected ? { ...n, selected: false } : n));
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

	// Deletion

	deleteEdge(id: NodeID, handle: HandleID) {
		console.log("deleteEdge", id, handle);
		const node = this.nodes().get(id);
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

	// Editing Edge

	resetEditingEdge() {
		this.editingEdge[1]({
			end: origin,
		});
	}

	enterEditingEnd(id: NodeID, ref?: HTMLDivElement, handle?: HandleID) {
		this.editingEdge[1](e =>
			e.nodeID && (e.nodeID !== id || e.handleID !== handle)
				? {
						...e,
						endRef: ref,
				  }
				: e,
		);
	}

	leaveEditingEnd(ref?: HTMLDivElement) {
		this.editingEdge[1](e =>
			e.nodeID && e.endRef === ref
				? {
						...e,
						endRef: undefined,
				  }
				: e,
		);
	}

	pickEditingEnd(id: NodeID, handle?: HandleID) {
		// If editing edge from other exists, connect.
		const e = this.editingEdge[0]();
		if (e.nodeID && (e.nodeID !== id || e.handleID !== handle)) {
			if (e.isSource && handle !== undefined) {
				return this.setEdge(id, handle, e.nodeID, e.handleID);
			} else if (!e.isSource && e.handleID !== undefined) {
				return this.setEdge(e.nodeID, e.handleID, id, handle);
			}
		}
	}

	setEdge(
		sinkID: NodeID,
		sinkHandle: HandleID,
		srcID: NodeID,
		srcHandle?: HandleID,
	) {
		// Check source
		const nodes = this.nodes(),
			sinkNode = nodes.get(sinkID),
			srcNode = nodes.get(srcID);
		if (!sinkNode || !srcNode) return;
		if (srcHandle === undefined) {
			if (ROOT_NODES.has(srcNode[0]().data.type)) return;
		} else {
			const h = srcNode[0]().handles[srcHandle];
			if (!h || h[0]().data.type !== HandleType.Source) return;
		}

		const h = sinkNode[0]().handles[sinkHandle];
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
		this.resetEditingEdge();
	}

	updateEdgeEnd(end: Position) {
		this.editingEdge[1](e => ({
			...e,
			end,
		}));
	}

	editEdge(id: NodeID, handle?: HandleID, pos?: Position) {
		// Add to editing edge, and add edge when it completed
		// Find the node
		const node = this.nodes().get(id);
		if (!node) return;
		const [n] = node;
		let isSource = true;
		if (handle !== undefined) {
			const h = n().handles[handle];
			if (!h) return;
			isSource = h[0]().data.type === HandleType.Source;
		}
		// Check if it is a source
		const e = this.editingEdge[0]();
		if (e.nodeID === id && e.handleID === handle) {
			this.resetEditingEdge();
			return;
		}
		if (!isSource === e.isSource) {
			return isSource
				? this.setEdge(e.nodeID!, e.handleID!, id, handle)
				: this.setEdge(id, handle!, e.nodeID!, e.handleID);
		} else {
			this.editingEdge[1]({
				isSource,
				nodeID: id,
				handleID: handle,
				end: pos ?? origin,
			});
		}
	}
}
