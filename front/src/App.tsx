import { type Component } from "solid-js";

import { Localed, } from "./locales";

import "./block";
import { default as ToastContainer } from "./block/ToastContainer";
import { NodeType, Nodes } from "@/common";
import { Hrm } from "@/hrm";

const App: Component = () => {
	const nodes: Nodes = [
		{
			id: "n1",
			pos: { x: 0, y: 0 },
			x: {
				type: NodeType.Alpha,
				val: "Hello, world!",
			},
		},
		{
			id: "n2",
			pos: { x: 0, y: 64 },
			x: {
				type: NodeType.Beta,
				args: [{ id: "n1" }],
			},
		},
		{
			id: "n3",
			pos: { x: 0, y: 128 },
			x: {
				type: NodeType.Delta,
				comment: "Hello, world!",
			},
		},
		{
			id: "n4",
			pos: { x: 0, y: 192 },
			x: {
				type: NodeType.Lambda,
				ret: {
					id: "n6",
					handle: 1,
				},
			},
		},
		{
			id: "n5",
			pos: { x: 0, y: 256 },
			x: {
				type: NodeType.Nu,
				name: {
					name: "Hello",
					module: "main.test.last",
				},
				lhs: 2,
				args: [{ id: "n1" }, { id: "n2" }, { id: "n3" }],
			},
		},
		{
			id: "n6",
			pos: { x: 0, y: 320 },
			x: {
				type: NodeType.Pi,
				name: {
					name: "Hello",
					module: "World",
				},
				args: 3,
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
