import { createSignal, untrack } from "solid-js";
import { NodeID, Nodes as CNodes, VWrap, Rect } from "@/common";
import { Nodes, Transform, thawNodes } from "./data";

export class State {
	rootRef?: HTMLDivElement;
	viewRef?: HTMLDivElement;

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
}
