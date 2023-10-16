import { Component, For, Show, createEffect } from "solid-js";
import { State } from "./state";
import { Node, stringifyNodeData } from "@/common";
import { Button, Color, InputGroup } from "@/block";
import InputCode from "@/block/InputCode";
import { TbSquareCheck, TbTrash } from "solid-icons/tb";

import * as jasen from "@/jasen";
import { addEventListeners } from "@/common/pointer-helper";
import { NodeColor } from "./data";

type SuggestProps = {
	label: string;
	text: string;
	selection?: number;
};

const Suggest: Component<SuggestProps> = props => {
	return (
		<button class="suggest" onClick={() => alert(props.label)}>
			{props.label}
		</button>
	);
};

type SuggestsProps = {
	items: SuggestProps[];
};

const Suggests: Component<SuggestsProps> = props => {
	return (
		<div class="suggests">
			<For each={props.items}>{item => <Suggest {...item} />}</For>
		</div>
	);
};

type InnerProps = {
	g: State;
	color: NodeColor;
	node: Node;
};

const HrmEditOverlayInner: Component<InnerProps> = props => {
	let ref: HTMLDivElement | undefined;
	let taRef: HTMLTextAreaElement | undefined;
	createEffect(() => {
		if (ref) {
			addEventListeners({}, ref);
		}
	});
	return (
		<div
			ref={ref}
			class="hrm-edit-overlay"
			style={{
				...props.g.nodeColorBd(props.color),
				transform: `translate(${props.node.pos.x - 16}px, ${
					props.node.pos.y - 16
				}px)`,
			}}>
			<InputGroup class="shadow-1 w-fit mb-1">
				<Button
					color={Color.danger}
					onClick={() => props.g.cancelEditNode()}>
					{" "}
					<TbTrash />{" "}
				</Button>
				<Button
					color={Color.success}
					onClick={() =>
						props.g.applyEditNode(taRef ? taRef.value : "")
					}>
					{" "}
					<TbSquareCheck />{" "}
				</Button>
			</InputGroup>
			<InputCode
				ref={taRef}
				autofocus={true}
				autoresize={true}
				class="shadow-1"
				placeholder="[NODE DATA]"
				value={stringifyNodeData(props.node.x)}
				onInput={e => {
					console.log(jasen.parse(e.currentTarget.value));
				}}
			/>
			<Suggests
				items={[
					{ label: "beta", text: "beta" },
					{ label: "gamma", text: "gamma" },
					{ label: "delta", text: "delta" },
					{ label: "epsilon", text: "epsilon" },
					{ label: "omega", text: "omega" },
					{ label: "alpha", text: "alpha" },
					{ label: "{", text: "{" },
					{ label: "beta", text: "beta" },
					{ label: "gamma", text: "gamma" },
					{ label: "delta", text: "delta" },
					{ label: "epsilon", text: "epsilon" },
					{ label: "omega", text: "omega" },
					{ label: "alpha", text: "alpha" },
					{ label: "{", text: "{" },
				]}
			/>
		</div>
	);
};

type HrmEditOverlayProps = {
	g: State;
};
const HrmEditOverlay: Component<HrmEditOverlayProps> = props => {
	return (
		<Show when={props.g.editingNode[0]()}>
			<HrmEditOverlayInner
				g={props.g}
				color={props.g.editingNode[0]()!.color}
				node={props.g.editingNode[0]()!.node}
			/>
		</Show>
	);
};

export default HrmEditOverlay;
