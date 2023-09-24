import { type Component } from "solid-js";

import { Localed, s } from "./locales";

import "./block";
import { default as ToastContainer, toast } from "./block/ToastContainer";
import { Node, substantiateNode, Hrm } from "./hrm";

const App: Component = () => {
	const nodeA = substantiateNode({
		data: {
			type: "default",
			label: "Test",
		},
		position: {
			x: 0,
			y: 0,
		},
		handles: {
			items: [{ name: "a" }, { name: "b" }, { name: "ret" }],
			lhs: 1,
		},
	});
	const nodeB = substantiateNode({
		data: {
			type: "default",
			label: "Test",
		},
		position: {
			x: 100,
			y: 100,
		},
		handles: {
			items: [
				{ name: "arg", sourceID: nodeA.id },
				{ name: "b" },
				{ name: "c", sourceID: nodeA.id, sourceHandle: 1 },
			],
			lhs: 2,
		},
	});
	const nodes: Node[] = [nodeA, nodeB];
	return (
		<Localed>
			<ToastContainer />
			<Hrm nodes={nodes} />
		</Localed>
	);
};

export default App;
