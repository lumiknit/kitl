import { type Component } from "solid-js";

import { Localed, s } from "./locales";

import "./block";
import { default as ToastContainer, toast } from "./block/ToastContainer";
import { NodeF, NodesF, Hrm } from "./hrm";

const App: Component = () => {
	const nodes: NodesF = [
		{
			id: "n1",
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
				items: [{ name: "lhs" }, { name: "arg1" }, { name: "arg2" }],
			},
		},
		{
			id: "n2",
			data: {
				type: "default",
				label: "Hello",
			},
			position: {
				x: 100,
				y: 100,
			},
			handles: {
				lhs: 1,
				items: [
					{
						name: "fallback",
						sourceID: "n1",
					},
					{ name: "arg" },
					{ name: "1" },
					{ name: "2" },
					{ name: "ret" },
				],
			},
		},
		{
			id: "n3",
			data: {
				type: "default",
				label: "Hello",
			},
			position: {
				x: 200,
				y: 200,
			},
			handles: {
				lhs: 1,
				items: [
					{ name: "fn", sourceID: "n1" },
					{ name: "1", sourceID: "n2" },
				],
			},
		},
		{
			id: "n4",
			data: {
				type: "default",
				label: "Hello",
			},
			position: {
				x: 300,
				y: 300,
			},
			handles: {
				lhs: 0,
				items: [
					{ name: "1", sourceID: "n1" },
					{ name: "2", sourceID: "n3" },
				],
			},
		},
	];
	return (
		<Localed>
			<ToastContainer />
			<div class="kitl-editor">
				<Hrm initialNodes={nodes} />
			</div>
		</Localed>
	);
};

export default App;
