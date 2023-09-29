import { Match, Switch } from "solid-js";
import { AlphaNodeData, Name, NodeData, NodeType } from "@/common";
import { SYM_BETA, SYM_DELTA, SYM_LAMBDA, SYM_PI } from "./data";

type HrmNodeBodyProps = {
	data: NodeData;
};

const HrmName = (props: { name: Name }) => (
	<div class="hrm-node-name">
		<div class="hrm-node-name-name">{props.name.name}</div>
		<div class="hrm-node-name-module">{"@" + props.name.module}</div>
	</div>
);

const HrmNodeBody = (props: HrmNodeBodyProps) => {
	return (
		<div class="hrm-node-item hrm-node-body">
			<Switch>
				<Match when={props.data.type === NodeType.Alpha}>
					{JSON.stringify((props.data as AlphaNodeData).val)}
				</Match>
				<Match when={props.data.type === NodeType.Beta}>
					<div class="hrm-node-mark">{SYM_BETA}</div>
				</Match>
				<Match when={props.data.type === NodeType.Delta}>
					<div class="hrm-node-mark">{SYM_DELTA}</div>
				</Match>
				<Match when={props.data.type === NodeType.Lambda}>
					<div class="hrm-node-mark">{SYM_LAMBDA}</div>
				</Match>
				<Match when={props.data.type === NodeType.Nu}>
					<HrmName name={(props.data as any).name} />
				</Match>
				<Match when={props.data.type === NodeType.Pi}>
					<div class="hrm-node-mark">{SYM_PI}</div>
					<HrmName name={(props.data as any).name} />
				</Match>
			</Switch>
		</div>
	);
};

export default HrmNodeBody;
