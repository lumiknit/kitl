import { type Component } from "solid-js";

import { Localed, s } from "./locales";

import "./block";
import { default as ToastContainer, toast } from "./block/ToastContainer";
import { NodeF, NodesF, Hrm } from "./hrm";

const App: Component = () => {
	const nodes: NodesF = [
		{
			id: "abc",
			data: {
				type: "default",
				label: "Test",
			},
			position: {
				x: 0,
				y: 0,
			},
			handles: {
				lhs: 1,
				items: [{ name: "a" }, { name: "b" }, { name: "ret" }],
			},
		},
		{
			id: "zxc",
			data: {
				type: "default",
				label: "Hello",
			},
			position: {
				x: 100,
				y: 0,
			},
			handles: {
				lhs: 1,
				items: [
					{
						name: "a",
						sourceID: "abc",
					},
					{ name: "b" },
					{ name: "ret" },
				],
			},
		},
	];
	return (
		<Localed>
			<ToastContainer />
			<Hrm initialNodes={nodes} />
		</Localed>
	);
};

export default App;
