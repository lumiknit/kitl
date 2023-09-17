import { For, type Component } from "solid-js";

import { Localed, s } from "./locales";

import "./block";
import { Button, Color, InputCheck, InputGroup, InputText } from "./block";
import InputLabel from "./block/InputLabel";
import { default as ToastContainer, toast } from "./block/ToastContainer";
import Hrm from "./hrm/Hrm";
import { Node, Edge, substantiateNode } from "./hrm";

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
	];
	const edges: Edge[] = [];
	return (
		<Localed>
			<ToastContainer />
			<Hrm nodes={nodes} edges={edges} />
		</Localed>
	);
};

export default App;
