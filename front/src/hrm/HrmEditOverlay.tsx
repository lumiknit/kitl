import { Component, Show, createEffect } from "solid-js";
import { State } from "./state";
import { Node } from "@/common";
import { Button, Color, InputGroup } from "@/block";
import InputCode from "@/block/InputCode";
import { TbDots, TbSquareCheck, TbTrash } from "solid-icons/tb";

type InnerProps = {
	g: State;
	node: Node;
};

const HrmEditOverlayInner: Component<InnerProps> = props => {
	let ref: HTMLDivElement | undefined;
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
				<Button color={Color.success}>
					{" "}
					<TbSquareCheck />{" "}
				</Button>
				<Button color={Color.danger}>
					{" "}
					<TbTrash />{" "}
				</Button>
				<Button color={Color.secondary}>
					{" "}
					<TbDots />{" "}
				</Button>
			</InputGroup>
			<InputCode
				autofocus
				autoresize
				class="shadow-1"
				placeholder="[NODE DATA]"
				value={props.node.id}
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
