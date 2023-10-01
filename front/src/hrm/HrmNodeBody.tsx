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

const Mark = (props: { mark: string }) => (
	<div class="hrm-node-mark">{props.mark}</div>
);

const HrmNodeBody = (props: HrmNodeBodyProps) => {
	return (
		<div class="hrm-node-item hrm-node-body">
			<Switch>
				<Match when={props.data.type === NodeType.Alpha}>
					{JSON.stringify((props.data as AlphaNodeData).val)}
				</Match>
				<Match when={props.data.type === NodeType.Beta}>
					<Mark mark={SYM_BETA} />
				</Match>
				<Match when={props.data.type === NodeType.Delta}>
					<Mark mark={SYM_DELTA} />
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
