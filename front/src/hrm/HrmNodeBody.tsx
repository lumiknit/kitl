import { Match, Show, Switch } from "solid-js";
import {
	AlphaNodeData,
	DeltaNodeData,
	Name,
	NodeData,
	NodeType,
} from "@/common";
import { SYM_BETA, SYM_DELTA, SYM_LAMBDA, SYM_PI } from "./data";

type HrmNodeBodyProps = {
	data: NodeData;
};

const HrmName = (props: { name: Name }) => (
	<div class="hrm-node-name">
		<div class="hrm-node-name-name">{props.name.name}</div>
		<Show when={props.name.module}>
			<div class="hrm-node-name-module">{"@" + props.name.module}</div>
		</Show>
	</div>
);

const Mark = (props: { mark: string }) => (
	<div class="hrm-node-mark">{props.mark}</div>
);

const HrmNodeBody = (props: HrmNodeBodyProps) => {
	return (
		<div class="hrm-node-item hrm-node-body">
			<Switch>
				<Match when={props.data.type === NodeType.Alpha}>
					<div class="hrm-node-json">
						{JSON.stringify((props.data as AlphaNodeData).val)}
					</div>
				</Match>
				<Match when={props.data.type === NodeType.Beta}>
					<Mark mark={SYM_BETA} />
				</Match>
				<Match when={props.data.type === NodeType.Delta}>
					<Mark mark={SYM_DELTA} />
					<Show when={(props.data as DeltaNodeData).comment}>
						<pre class="hrm-node-comment no-user-select no-pointer-events">
							{(props.data as DeltaNodeData).comment}
						</pre>
					</Show>
				</Match>
				<Match when={props.data.type === NodeType.Lambda}>
					<Mark mark={SYM_LAMBDA} />
				</Match>
				<Match when={props.data.type === NodeType.Nu}>
					<HrmName name={(props.data as any).name} />
				</Match>
				<Match when={props.data.type === NodeType.Pi}>
					<Mark mark={SYM_PI} />
					<HrmName name={(props.data as any).name} />
				</Match>
			</Switch>
		</div>
	);
};

export default HrmNodeBody;
