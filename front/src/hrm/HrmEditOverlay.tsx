import { Component, For, Show, createEffect } from "solid-js";
import { State } from "./state";
import { Node, stringifyNodeData } from "@/common";
import { Button, Color, InputGroup } from "@/block";
import InputCode from "@/block/InputCode";
import { TbSquareCheck, TbTrash } from "solid-icons/tb";

import * as jasen from "@/jasen";

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
	node: Node;
};

const HrmEditOverlayInner: Component<InnerProps> = props => {
	let ref: HTMLDivElement | undefined;
	let taRef: HTMLTextAreaElement | undefined;
	createEffect(() => {
		if (ref) {
			const events = ["mousedown", "touchstart", "pointerdown", "wheel"];
			const stopPropagation = (e: Event) => e.stopPropagation();
			for (const e of events) {
				ref.addEventListener(e, stopPropagation);
			}
		}
	});
	return (
		<div
			ref={ref}
			class="hrm-edit-overlay"
			style={{
				transform: `translate(${props.node.pos.x}px, ${props.node.pos.y}px)`,
			}}>
			<InputGroup class="shadow-1 w-fit">
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
			<HrmEditOverlayInner g={props.g} node={props.g.editingNode[0]()!} />
		</Show>
	);
};

export default HrmEditOverlay;
