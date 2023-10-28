import { Component, For, Show, onMount } from "solid-js";
import { State } from "./state";
import { Node, stringifyNodeData } from "@/common";
import { Button, Color, InputGroup } from "@/block";
import InputCode from "@/block/InputCode";
import { TbBackspace, TbSquareCheck, TbSquareX } from "solid-icons/tb";

import * as jasen from "@/jasen";
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
	const handleKeydown = (e: KeyboardEvent) => {
		if (!taRef) return;
		if (e.key === "Enter") {
			let shouldApply = e.ctrlKey || e.metaKey;
			shouldApply ||= !jasen.tasteLong(taRef.value);
			if (shouldApply) {
				props.g.applyEditNode(taRef ? taRef.value : "");
				return true;
			}
		}
		return false;
	};
	onMount(() => {
		if (ref) {
			const events = ["mousedown", "touchstart", "pointerdown", "wheel"];
			const stopPropagation = (e: Event) => e.stopPropagation();
			for (const e of events) {
				ref.addEventListener(e, stopPropagation);
			}
			taRef?.click();
			props.g.fitTransformFor(ref);
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
					color={Color.success}
					onClick={() =>
						props.g.applyEditNode(taRef ? taRef.value : "")
					}>
					<TbSquareCheck />
				</Button>
				<Button
					color={Color.warning}
					onClick={() => {
						taRef!.value = "";
						taRef!.focus();
					}}>
					<TbBackspace />
				</Button>
				<Button
					color={Color.danger}
					onClick={() => props.g.cancelEditNode()}>
					<TbSquareX />
				</Button>
			</InputGroup>
			<InputCode
				ref={taRef}
				autofocus={true}
				autoresize={true}
				class="shadow-1"
				placeholder="[NODE DATA]"
				value={stringifyNodeData(props.node.x)}
				onKeyDown={handleKeydown}
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
