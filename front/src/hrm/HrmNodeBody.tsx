import { Show } from "solid-js";
import {
	AlphaNodeData,
	DeltaNodeData,
	Name,
	NodeData,
	NodeType,
} from "@/common";
import { SYM_BETA, SYM_DELTA, SYM_LAMBDA, SYM_PI } from "./data";
import { compactify } from "@/jasen";
import { Dynamic } from "solid-js/web";
import { renameSymbol } from "@/common/name-symbols";

type HrmNodeBodyProps = {
	data: NodeData;
};

const HrmName = (props: { name: Name }) => (
	<div class="hrm-node-name">
		<div class="hrm-node-name-name">{renameSymbol(props.name.name)}</div>
		<Show when={props.name.module}>
			<div class="hrm-node-name-module">{"@" + props.name.module}</div>
		</Show>
	</div>
);

const Mark = (props: { mark: string }) => (
	<div class="hrm-node-mark">{props.mark}</div>
);

const HrmNodeBody = (props: HrmNodeBodyProps) => {
	const options = {
		[NodeType.Alpha]: () => (
			<div class="hrm-node-json">
				{compactify((props.data as AlphaNodeData).val)}
			</div>
		),
		[NodeType.Beta]: () => <Mark mark={SYM_BETA} />,
		[NodeType.Delta]: () => (
			<>
				<Mark mark={SYM_DELTA} />
				<Show when={(props.data as DeltaNodeData).comment}>
					<pre class="hrm-node-comment no-user-select no-pointer-events">
						{(props.data as DeltaNodeData).comment}
					</pre>
				</Show>
			</>
		),
		[NodeType.Lambda]: () => <Mark mark={SYM_LAMBDA} />,
		[NodeType.Nu]: () => <HrmName name={(props.data as any).name} />,
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

export default HrmNodeBody;
