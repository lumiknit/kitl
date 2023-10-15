import { batch, createSignal, untrack } from "solid-js";
import {
	NodeID,
	Node as CNode,
	Nodes as CNodes,
	VWrap,
	Rect,
	HandleID,
	Position,
	origin,
	ROOT_NODES,
	NodeType,
	genID,
	BetaNodeData,
	Size,
	parseNodeData,
	ShapedRect,
} from "@/common";
import {
	EditingEdge as ConnectingEdge,
	EditingEdgeEnd as ConnectingEnd,
	HandleType,
	Nodes,
	SinkHandleData,
	Transform,
	freezeNode,
	freezeNodes,
	renameHandles,
	sourceToSinkHandle,
	thawNode,
	thawNodes,
} from "./data";
import { HSL, HSL2RGB, RGB2GRAY, hslCss } from "@/common/color";
import { PointerID } from "@/common/pointer-helper";

/* State */

export class State {
	// Configuration
	nodeColor: VWrap<HSL>; // Color of nodes

	// Graph data
	nodes: () => Nodes;
	setNodes: (a: Nodes | ((ns: Nodes) => Nodes)) => void;

	// View data
	transform: VWrap<Transform>;

	// References
	rootRef?: HTMLDivElement;
	viewRef?: HTMLDivElement;

	// Editing Node
	editingNode: VWrap<CNode | undefined>;

	// Connecting Edge
	connectingEdge: VWrap<ConnectingEdge | undefined>;
	connectingEnd: VWrap<ConnectingEnd>;

	// Undo/redo history
	history: CNodes[];
	historyIndex: number;

	// Mode
	selectMode: boolean = false;

	constructor(initialNodes?: CNodes) {
		if (!initialNodes) initialNodes = [];
		const [nodes, setNodes] = createSignal<Nodes>(thawNodes(initialNodes), {
			equals: false,
		});
		this.nodes = nodes;
		this.setNodes = setNodes;
		this.editingNode = createSignal();
		this.connectingEdge = createSignal();
		this.connectingEnd = createSignal({ pos: origin });
		this.transform = [() => ({ x: 0, y: 0, z: 1 }), () => {}];
		// History
		this.history = [initialNodes];
		this.historyIndex = 0;
		// Color
		this.nodeColor = createSignal({ h: 0, s: 0.52, l: 0.7 });
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

	// Color theme

	nodeColorBg(hue: number) {
		const c = this.nodeColor[0](),
			fg = RGB2GRAY(...HSL2RGB(hue, c.s, c.l)) > 192 ? "#000" : "#fff",
			bg = hslCss(hue, c.s, c.l);
		return {
			color: fg,
			"background-color": bg,
			"border-color": bg,
		};
	}

	nodeColorBd(hue: number) {
		const c = this.nodeColor[0]();
		return {
			"border-color": hslCss(hue, c.s, c.l),
		};
	}

	nodeColorStroke(hue: number) {
		const c = this.nodeColor[0]();
		return {
			stroke: hslCss(hue, c.s, c.l),
		};
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
			this.setNodes(thawNodes(this.history[--this.historyIndex]));
		}
	}

	redo() {
		if (this.historyIndex < this.history.length - 1) {
			this.setNodes(thawNodes(this.history[++this.historyIndex]));
		}
	}

	// View & Transforms

	size(): Size | undefined {
		if (!this.rootRef) return;
		const rect = this.rootRef.getBoundingClientRect();
		return { w: rect.width, h: rect.height };
	}

	viewPos(x: number, y: number): Position | undefined {
		// Client position to graph position
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

	// Range

	usedRect(): Rect {
		// Return the smallest rect that contains all nodes
		const r = { x: 0, y: 0, w: 0, h: 0 };
		for (const [, node] of this.nodes()) {
			const n = node[0]();
			const pos = n.position;
			const size = n.size;
			if (r.x > pos.x) {
				r.w += r.x - pos.x;
				r.x = pos.x;
			}
			if (r.y > pos.y) {
				r.h += r.y - pos.y;
				r.y = pos.y;
			}
			r.w = Math.max(r.w, pos.x + size.w - r.x);
			r.h = Math.max(r.h, pos.y + size.h - r.y);
		}
		return r;
	}

	// Node / Handle Getter

	viewRectOf(id: NodeID, handle?: HandleID): ShapedRect | undefined {
		const node = this.nodes().get(id);
		if (!node) return;
		const n = node[0]();
		if (handle === undefined) {
			const r = this.viewRect(n.ref);
			if (!r) return;
			return {
				...r,
				angular: n.angular,
			};
		}
		const ref = n.handles[handle][0]().ref;
		if (!ref) return;
		return this.viewRect(ref);
	}

	// Add

	addEmptyNode(pos?: Position): NodeID {
		if (!pos) {
			const t = this.transform[0]();
			const rootRef = this.rootRef;
			if (!rootRef) {
				pos = { x: 0, y: 0 };
			} else {
				// Find center
				const rect = rootRef.getBoundingClientRect();
				pos = {
					x: (rect.width / 2 - t.x) / t.z,
					y: (rect.height / 2 - t.y) / t.z,
				};
			}
		}
		const x: BetaNodeData = {
			type: NodeType.Beta,
			args: [],
		};
		const emptyNode: CNode = {
			id: genID(),
			pos,
			x,
		};
		this.setNodes(ns => {
			ns.set(emptyNode.id, thawNode(emptyNode));
			return ns;
		});
		this.saveHistory();
		return emptyNode.id;
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

	selectOneNode(id: NodeID) {
		// Check is selected
		for (const [nid, node] of this.nodes()) {
			if (nid === id) {
				node[1](n => ({
					...n,
					selected: !n.selected,
				}));
			} else if (!this.selectMode) {
				node[1](n =>
					n.selected
						? {
								...n,
								selected: false,
						  }
						: n,
				);
			}
		}
	}

	// Deletion

	deleteSelectedNodes() {
		this.setNodes(ns => {
			// Find delete nodes
			const toDelete = new Set<NodeID>();
			for (const [id, node] of ns) {
				const n = node[0]();
				if (n.selected && !ROOT_NODES.has(n.data.type)) {
					toDelete.add(id);
				}
			}
			for (const [id, node] of ns) {
				if (toDelete.has(id)) {
					ns.delete(id);
				} else {
					// Delete edges to deleted nodes
					const n = node[0]();
					const handles = n.handles;
					for (const [, update] of handles) {
						update(h => {
							if (h.data.type === HandleType.Sink) {
								const sourceID = h.data.sourceID;
								if (sourceID && toDelete.has(sourceID)) {
									return {
										...h,
										data: { type: HandleType.Sink },
									};
								}
							}
							return h;
						});
					}
				}
			}
			return ns;
		});
		this.saveHistory();
	}

	deleteEdge(id: NodeID, handle: HandleID) {
		const node = this.nodes().get(id);
		if (node) {
			node[0]().handles[handle][1](h =>
				h.data.type !== HandleType.Sink
					? h
					: {
							...h,
							data: { type: HandleType.Sink },
					  },
			);
		}
	}

	// Connecting Edge

	resetConnectingState() {
		batch(() => {
			this.connectingEdge[1](undefined);
			this.connectingEnd[1]({ pos: origin });
		});
	}

	setTempConnectingEnd(id: NodeID, ref?: HTMLDivElement, handle?: HandleID) {
		batch(() => {
			const e = this.connectingEdge[0]();
			if (e && (e.nodeID !== id || e.handleID !== handle)) {
				this.connectingEnd[1](ee => ({
					...ee,
					ref,
				}));
			}
		});
	}

	unsetTempConnectingEnd(ref?: HTMLDivElement) {
		batch(() => {
			const e = this.connectingEdge[0]();
			if (e) {
				this.connectingEnd[1](ee =>
					ee.ref === ref ? { ...ee, ref: undefined } : ee,
				);
			}
		});
	}

	finConnecting(id: NodeID, handle?: HandleID) {
		// If editing edge from other exists, connect.
		const e = this.connectingEdge[0]();
		if (e && (e.nodeID !== id || e.handleID !== handle)) {
			if (e.isSource && handle !== undefined) {
				this.connectEdge(id, handle, e.nodeID, e.handleID);
			} else if (!e.isSource && e.handleID !== undefined) {
				this.connectEdge(e.nodeID, e.handleID, id, handle);
			}
		}
	}

	makeLeftHandle(id: NodeID) {
		const node = this.nodes().get(id);
		if (!node) return 0;
		node[1](n => {
			n.handles.unshift(sourceToSinkHandle(""));
			n.handles.lhs++;
			return { ...n };
		});
		renameHandles(node[0]());
		return 0;
	}

	makeRightHandle(id: NodeID) {
		const node = this.nodes().get(id);
		if (!node) return 0;
		const n = node[0](),
			idx = n.handles.length;
		node[1](n => {
			n.handles.push(sourceToSinkHandle(""));
			return { ...n };
		});
		renameHandles(n);
		return idx;
	}

	connectEdge(
		sinkID: NodeID,
		sinkHandle: HandleID,
		srcID: NodeID,
		srcHandle?: HandleID,
	) {
		batch(() => {
			if (sinkHandle === -Infinity) {
				// Shift all handles to right
				sinkHandle = this.makeLeftHandle(sinkID);
			}
			if (sinkHandle === Infinity) {
				// Shift all handles to left
				sinkHandle = this.makeRightHandle(sinkID);
			}
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
			this.resetConnectingState();
			this.saveHistory();
		});
	}

	updateConnectingEnd(end: Position) {
		this.connectingEnd[1](e => ({
			...e,
			pos: end,
		}));
	}

	addConnectingEnd(
		pointerID: PointerID,
		id: NodeID,
		handle?: HandleID,
		pos?: Position,
	) {
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
		const e = this.connectingEdge[0]();
		if (e && e.nodeID === id && e.handleID === handle) {
			this.resetConnectingState();
			return;
		}
		if (e && !isSource === e.isSource) {
			return isSource
				? this.connectEdge(e.nodeID!, e.handleID!, id, handle)
				: this.connectEdge(id, handle!, e.nodeID!, e.handleID);
		} else {
			batch(() => {
				this.connectingEdge[1]({
					pointerID: pointerID,
					isSource,
					nodeID: id,
					handleID: handle,
				});
				if (pos) {
					this.connectingEnd[1](ee => ({ ...ee, pos }));
				}
			});
		}
	}

	// Edit Node
	editNode(id: NodeID) {
		// Find node
		const node = this.nodes().get(id);
		if (node && !ROOT_NODES.has(node[0]().data.type)) {
			this.editingNode[1](freezeNode(id, node[0]()));
		}
	}

	applyEditNode(s: string) {
		batch(() => {
			// Convert string to node
			const editing = this.editingNode[0]();
			if (!editing) return;
			const id = editing?.id;
			const data = parseNodeData(s);
			const newNode: CNode = {
				...editing,
				x: data,
			};
			const thawed = thawNode(newNode);
			// Get original node
			const oldNode = this.nodes().get(id);
			// Transfer original edges
			const oldHandles = oldNode ? oldNode[0]().handles : [];
			const newHandles = thawed[0]().handles;
			for (let i = 0; i < newHandles.length; i++) {
				const oldHandle = oldHandles[i];
				newHandles[i][1](h => {
					if (h.data.type !== HandleType.Sink) return h;
					const data: SinkHandleData = { type: HandleType.Sink };
					if (oldHandle) {
						// Try to get original edge
						const oldEdge = oldHandle[0]().data;
						if (oldEdge.type === HandleType.Sink) {
							data.sourceID = oldEdge.sourceID;
							data.sourceHandle = oldEdge.sourceHandle;
						}
					}
					// Otherwise, remove edge
					return {
						...h,
						data,
					};
				});
			}
			this.setNodes(ns => {
				ns.set(id, thawed);
				return ns;
			});
			this.editingNode[1](undefined);
		});
	}

	cancelEditNode() {
		this.editingNode[1](undefined);
	}
}
