import {
	BetaNodeData,
	Node as CNode,
	Nodes as CNodes,
	HandleID,
	NON_SOURCE_NODES,
	NodeID,
	NodeType,
	PathString,
	Position,
	ROOT_NODES,
	Rect,
	Size,
	Source,
	VWrap,
	genID,
	origin,
	stringifyNodeData,
} from "@/common";
import { HSL2RGB, RGB2GRAY, hslCss } from "@/common/color";
import { PointerID } from "@/common/pointer-helper";
import { batch, createSignal, untrack } from "solid-js";
import {
	ConnectingEdge,
	ConnectingEdgeEnd as ConnectingEnd,
	Handle,
	HandleType,
	Nodes,
	Transform,
} from "./data";
import {
	freezeNode,
	freezeNodes,
	makeEditedNodeData,
	renameHandles,
	sourceToSinkHandle,
	thawNode,
	thawNodes,
} from "@/hrm-kitl";
import { createDelayedSignal } from "@/solid-utils/indes";
import { loadString, saveString } from "@/common/clipboard";
import { toastError } from "@/block/ToastContainer";

/* State */

const defaultKeymap = (): Map<string, string> =>
	new Map([
		["C-a", "selectAll"],
		["M-a", "selectAll"],
		["Backspace", "deleteSelectedNodes"],
		["Delete", "deleteSelectedNodes"],
		["a", "addEmptyNode"],
		["C-=", "zoomIn"],
		["C--", "zoomOut"],
	]);

export class State {
	// Module name
	path: PathString;
	name: string;

	// Graph data
	nodes: () => Nodes;
	setNodes: (a: Nodes | ((ns: Nodes) => Nodes)) => void;

	// View data
	transform: VWrap<Transform>;

	// References
	rootRef?: HTMLDivElement;
	viewRef?: HTMLDivElement;

	// Selected State
	selectedNodes: VWrap<number>;

	// Connecting Edge
	connectingEdge: VWrap<ConnectingEdge | undefined>;
	connectingEnd: VWrap<ConnectingEnd>;

	// Undo/redo history
	history: CNodes[];
	historyIndex: number;

	// Mode
	selectMode: boolean = false;

	// Keymap
	keymap: Map<string, string> = new Map();

	// Callbacks
	onEditNode?: (id: NodeID) => void;

	constructor(path: string, name: string, initialNodes: Nodes) {
		const [nodes, setNodes] = createSignal<Nodes>(initialNodes, {
			equals: false,
		});
		this.path = path;
		this.name = name;
		this.nodes = nodes;
		this.setNodes = setNodes;
		this.selectedNodes = createSignal(0);
		this.connectingEdge = createSignal();
		this.connectingEnd = createSignal({ pos: origin });
		this.transform = createDelayedSignal<Transform>(16, {
			x: 0,
			y: 0,
			z: 1,
		});
		// History
		this.history = [freezeNodes(this.nodes())];
		this.historyIndex = 0;
		// Keymap
		this.keymap = defaultKeymap();
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

	getSL() {
		const computed = getComputedStyle(document.documentElement),
			s = Number(computed.getPropertyValue("--hrm-node-saturate")),
			l = Number(computed.getPropertyValue("--hrm-node-lightness"));
		return [s, l];
	}

	nodeColorBg(hue: number) {
		const [s, l] = this.getSL(),
			fg = RGB2GRAY(...HSL2RGB(hue, s, l)) > 192 ? "#000" : "#fff",
			bg = hslCss(hue, s, l);
		return {
			color: fg,
			"background-color": bg,
			"border-color": bg,
		};
	}

	nodeColorBd(hue: number) {
		const [s, l] = this.getSL();
		return {
			"border-color": hslCss(hue, s, l),
		};
	}

	nodeColorStroke(hue: number) {
		const [s, l] = this.getSL();
		return {
			stroke: hslCss(hue, s, l),
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

	centerPos(): Position | undefined {
		const size = this.size();
		if (!size) return;
		const t = untrack(this.transform[0]);
		return {
			x: -t.x / t.z + size.w / 2 / t.z,
			y: -t.y / t.z + size.h / 2 / t.z,
		};
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
		const nodes = this.nodes();
		// Pick the first node as the initial rect
		const first = nodes.values().next().value;
		if (!first) return r;
		r.x = first[0]().position.x;
		r.y = first[0]().position.y;
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

	viewRectOf(id: NodeID, handle?: HandleID): Rect | undefined {
		const node = this.nodes().get(id);
		if (!node) return;
		const n = node[0](),
			ref = handle === undefined ? n.ref : n.handles[handle][0]().ref;
		if (!ref) return;
		return this.viewRect(ref);
	}

	// Add

	addEmptyNode(pos?: Position): NodeID {
		if (!pos) {
			pos = this.centerPos() ?? { x: 0, y: 0 };
		}
		const id = genID();
		const args: Source[] = [];
		// If connecting edge exists, connect to it
		const ce = this.connectingEdge[0]();
		if (ce) {
			if (ce.isSource) {
				args.push({
					id: ce.nodeID,
					handle: ce.handleID,
				});
			} else {
				const n = this.nodes().get(ce.nodeID);
				if (n) {
					const h = n[0]().handles[ce.handleID!];
					h[1](h => ({
						...h,
						data: {
							type: HandleType.Sink,
							sourceID: id,
						},
					}));
				}
			}
		}
		this.connectingEdge[1](undefined);
		const x: BetaNodeData = {
			type: NodeType.Beta,
			name: { name: "<|", module: "_" },
			lhs: args.length,
			args,
		};
		const emptyNode: CNode = {
			id,
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

	translateOneNode(id: NodeID, dx: number, dy: number, zoom: number) {
		const node = this.nodes().get(id);
		if (!node) return;
		node[1](n => ({
			...n,
			position: {
				x: n.position.x + dx / zoom,
				y: n.position.y + dy / zoom,
			},
		}));
	}

	translateSelectedNodes(dx: number, dy: number, zoom: number) {
		for (const [, node] of this.nodes()) {
			node[1](n => {
				if (!n.selected) return n;
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
		batch(() => {
			const nodes = this.nodes();
			for (const [, node] of nodes) {
				node[1](n => (n.selected ? n : { ...n, selected: true }));
			}
			this.selectedNodes[1](nodes.size);
		});
	}

	deselectAll() {
		batch(() => {
			for (const [, node] of this.nodes()) {
				node[1](n => (n.selected ? { ...n, selected: false } : n));
			}
			this.selectedNodes[1](0);
		});
	}

	selectOneNode(id: NodeID, keep?: boolean) {
		console.log(id);
		keep ||= this.selectMode;
		batch(() => {
			let selected = false;
			this.connectingEdge[1](undefined);
			// Check is selected
			for (const [nid, node] of this.nodes()) {
				if (nid === id) {
					selected = !node[0]().selected;
					node[1](n => ({
						...n,
						selected: !n.selected,
					}));
				} else if (!keep) {
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
			this.selectedNodes[1](n =>
				keep ? (selected ? n + 1 : n - 1) : selected ? 1 : 0,
			);
		});
	}

	selectOneNodeWithMode(id: NodeID, keep?: boolean) {
		this.selectOneNode(id, keep);
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
			this.selectedNodes[1](n => n - toDelete.size);
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
				if (NON_SOURCE_NODES.has(srcNode[0]().data.type)) return;
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
		// Unselect all nodes
		this.deselectAll();
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

	// Valid source

	isValidHandle(nodes: Nodes, handle: Handle): boolean {
		if (handle.data.type !== HandleType.Sink) return true;
		if (!handle.data.sourceID) return true;
		const sourceNode = nodes.get(handle.data.sourceID);
		if (!sourceNode) return false;
		const n = sourceNode[0](),
			h = handle.data.sourceHandle;
		if (NON_SOURCE_NODES.has(n.data.type) || h === undefined) return true;
		const handles = n.handles;
		if (!(0 <= h && handles.length)) return false;
		return handles[h]![0]().data.type === HandleType.Source;
	}

	// Edit Node
	editNode(id: NodeID) {
		setTimeout(() => {
			this.onEditNode?.(id);
		}, 30);
	}

	getNodeStringData(id: string): string {
		const node = this.nodes().get(id);
		return node ? stringifyNodeData(freezeNode(id, node[0]()).x) : "";
	}

	applyEditNode(id: string, s: string) {
		batch(() => {
			const node = this.nodes().get(id);
			if (!node) return;
			const n = node[0]();
			const color = n.color;
			const frozen = freezeNode(id, node[0]());
			const newNode: CNode = {
				...frozen,
				x: makeEditedNodeData(frozen.x, s),
			};
			const thawed = thawNode(newNode);
			// Get original node
			thawed[1](thawed => ({
				...thawed,
				color,
			}));
			// Check edges and disconnect to invalid sink nodes
			const newHandles = thawed[0]().handles;
			for (const [, node] of this.nodes()) {
				for (const [, handle] of node[0]().handles.entries()) {
					const h = handle[0]();
					if (
						h.data.type === HandleType.Sink &&
						h.data.sourceID === id
					) {
						if (
							(h.data.sourceHandle === undefined &&
								NON_SOURCE_NODES.has(n.data.type)) ||
							(h.data.sourceHandle !== undefined &&
								(h.data.sourceHandle >= newHandles.length ||
									newHandles[h.data.sourceHandle][0]().data
										.type !== HandleType.Source))
						) {
							// Remove edge
							handle[1](h => ({
								...h,
								data: {
									type: HandleType.Sink,
								},
							}));
						}
					}
				}
			}
			this.setNodes(ns => {
				ns.set(id, thawed);
				return ns;
			});
		});
	}

	// Copy & Paste

	cutSelectedNodes() {
		this.copySelectedNodes();
		this.deleteSelectedNodes();
	}

	copySelectedNodes() {
		// Copy nodes into clipboard
		// First, freeze them.
		const nodes = this.nodes();
		const frozen = [];
		for (const [id, node] of nodes) {
			if (node[0]().selected) {
				frozen.push(freezeNode(id, node[0]()));
			}
		}
		const json = JSON.stringify(frozen);
		saveString(json);
	}

	async pasteNodes() {
		// Get center of screen
		const screenCenter: Position = this.centerPos() ?? { x: 0, y: 0 };
		// Load from clipboard
		const contents = await loadString();
		let nodes = JSON.parse(contents) as CNode[];
		// Check node type and reassign IDs
		const renameMap = new Map<NodeID, NodeID>();
		try {
			const center = { x: 0, y: 0 };
			// Ignore root nodes
			nodes = nodes.filter(n => !ROOT_NODES.has(n.x.type));
			// Find center of nodes
			for (const n of nodes) {
				center.x += n.pos.x;
				center.y += n.pos.y;
			}
			center.x /= nodes.length;
			center.y /= nodes.length;
			// Assign new IDs and translate
			for (const n of nodes) {
				const id = genID();
				renameMap.set(n.id, id);
				n.id = id;
				n.pos.x += screenCenter.x - center.x;
				n.pos.y += screenCenter.y - center.y;
			}
		} catch (e) {
			toastError("Clipboard contents are invalid.");
			return;
		}
		// Paste nodes
		batch(() => {
			this.setNodes(ns => {
				for (const n of nodes) {
					// Check handles
					const thawed = thawNode(n);
					// Check handles
					for (const [, updateHandle] of thawed[0]().handles) {
						updateHandle(h => {
							if (
								h.data.type !== HandleType.Sink ||
								h.data.sourceID === undefined
							)
								return h;
							if (renameMap.has(h.data.sourceID)) {
								console.log(
									"rename",
									h.data.sourceID,
									renameMap.get(h.data.sourceID),
								);
								return {
									...h,
									data: {
										...h.data,
										sourceID: renameMap.get(
											h.data.sourceID,
										)!,
									},
								};
							}
							if (!this.isValidHandle(ns, h)) {
								return {
									...h,
									data: {
										type: HandleType.Sink,
									},
								};
							}
							return h;
						});
					}
					ns.set(n.id, thawed);
				}
				return ns;
			});
		});
	}

	// Keymap & Commands

	handleKey(key: string) {
		const commandName = this.keymap.get(key);
		if (commandName && commandName in this) {
			(this as any)[commandName]();
		}
	}

	zoomIn() {
		this.transform[1](t => ({
			...t,
			z: t.z * 1.1,
		}));
	}

	zoomOut() {
		this.transform[1](t => ({
			...t,
			z: t.z / 1.1,
		}));
	}

	zoomAll() {
		const rect = this.usedRect();
		const paneSize = this.size();
		if (!rect || !paneSize) return;
		rect.w = Math.max(rect.w, 1);
		rect.h = Math.max(rect.h, 1);
		const zoomX = paneSize.w / rect.w,
			zoomY = paneSize.h / rect.h,
			z = Math.min(zoomX, zoomY, 8);
		const x = -rect.x * z + (paneSize.w - rect.w * z) / 2,
			y = -rect.y * z + (paneSize.h - rect.h * z) / 2;
		this.transform[1]({ x, y, z });
	}

	resetZoom() {
		this.transform[1](() => ({
			x: 0,
			y: 0,
			z: 1,
		}));
	}
}
