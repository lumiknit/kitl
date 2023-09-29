import { createSignal } from "solid-js";
import { NodeID, Nodes as CNodes } from "@/common";
import { Nodes, thawNodes } from "./data";

export class GraphState {
	nodes: () => Nodes;
	update: (a: Nodes | ((ns: Nodes) => Nodes)) => void;

	constructor(initialNodes: CNodes) {
		const [nodes, setNodes] = createSignal<Nodes>(thawNodes(initialNodes));
		this.nodes = nodes;
		this.update = setNodes;
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
			if (nid === id) {
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
