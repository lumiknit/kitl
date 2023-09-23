import { For, type Component } from "solid-js";

import { Localed, s } from "./locales";

import "./block";
import { Button, Color, InputCheck, InputGroup, InputText } from "./block";
import InputLabel from "./block/InputLabel";
import { default as ToastContainer, toast } from "./block/ToastContainer";
import { Node, Edge, substantiateNode, substantiateEdge, Hrm } from "./hrm";

const App: Component = () => {
	const nodes: Node[] = [
		substantiateNode({
			data: {
				type: "default",
				label: "Test",
			},
			position: {
				x: 0,
				y: 0,
			},
		}),
		substantiateNode({
			data: {
				type: "default",
				label: "Test",
			},
			position: {
				x: 100,
				y: 100,
			},
		}),
	];
	const edges: Edge[] = [
		substantiateEdge({
			sourceID: nodes[0].id,
			targetID: nodes[1].id,
		}),
	];
	return (
		<Localed>
			<ToastContainer />
			<Hrm nodes={nodes} edges={edges} />
		</Localed>
	);
};

export default App;
