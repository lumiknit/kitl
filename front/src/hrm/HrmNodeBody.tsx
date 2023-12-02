import { Component, Show } from "solid-js";
import {
	AlphaNodeData,
	DeltaNodeData,
	Json,
	Name,
	NodeData,
	NodeType,
	VWrap,
} from "@/common";
import { Node, SYM_DELTA, SYM_LAMBDA, SYM_PI } from "./data";
import { compactify } from "@/jasen";
import { Dynamic } from "solid-js/web";
import { renameSymbol } from "@/common/name-symbols";

// Helpers

const shortString = (value: string) =>
	value.length > 16 ? `"${value.slice(0, 16)}...` : `"${value}"`;

const jsonToBrief = (value: Json) => {
	switch (typeof value) {
		case "string":
			return shortString(value);
		case "object": {
			if (value === null) return "null";
			if (Array.isArray(value))
				return value.length > 0 ? `[...(${value.length})]` : "[]";
			const keys = Object.keys(value);
			return keys.length > 0
				? `{${shortString(keys[0])}:...(${keys.length})}`
				: "{}";
		}
	}
	return JSON.stringify(value);
};

type HrmNodeBodyProps = {
	data: NodeData;
};

const HrmName = (props: { name: Name }) => (
	<div class="hrm-node-name">
		<div
			classList={{
				"hrm-node-name-name": true,
				"hrm-node-name-builtin": props.name.module === "_",
			}}>
			{renameSymbol(props.name.name)}
		</div>
		<Show when={props.name.module && props.name.module !== "_"}>
			<div class="hrm-node-name-module">{"@" + props.name.module}</div>
		</Show>
	</div>
);

const Mark = (props: { mark: string }) => (
	<div class="hrm-node-mark">{props.mark}</div>
);

export const HrmNodeBody: Component<HrmNodeBodyProps> = props => {
	const options = {
		[NodeType.Alpha]: () => (
			<div class="hrm-node-json">
				{jsonToBrief((props.data as AlphaNodeData).val)}
			</div>
		),
		[NodeType.Beta]: () => <HrmName name={(props.data as any).name} />,
		[NodeType.Delta]: () => <Mark mark={SYM_DELTA} />,
		[NodeType.Lambda]: () => <Mark mark={SYM_LAMBDA} />,
		[NodeType.Pi]: () => (
			<>
				<Mark mark={SYM_PI} />
				<HrmName name={(props.data as any).name} />
			</>
		),
	};
	return (
		<div class="hrm-node-item hrm-node-body">
			<Dynamic component={options[props.data.type]} />
		</div>
	);
};

type DetailsProps = {
	nodeW: VWrap<Node>;
	data: NodeData;
	onClick: () => void;
};

export const HrmNodeDetails: Component<DetailsProps> = props => {
	let ref: HTMLDivElement | undefined;
	const [n]: VWrap<Node> = props.nodeW;
	const options = {
		[NodeType.Alpha]: () => (
			<div
				ref={ref}
				class="hrm-node-details shadow-1"
				style={{
					left: `${n().position.x + 16}px`,
					top: `${n().position.y}px`,
					transform: "translate(0%, -100%)",
				}}>
				<div class="hrm-node-json">
					{compactify((props.data as AlphaNodeData).val)}
				</div>
			</div>
		),
		[NodeType.Delta]: () => (
			<div
				ref={ref}
				class="hrm-node-details shadow-1"
				style={{
					left: `${n().position.x + 16}px`,
					top: `${n().position.y + n().size.h}px`,
				}}>
				<pre class="hrm-node-comment no-user-select no-pointer-events">
					{(props.data as DeltaNodeData).comment}
				</pre>
			</div>
		),
	};
	return <Dynamic component={(options as any)[n().data.type]} />;
};
