import { Button, Color, InputGroup, InputText } from "@/block";
import InputLabel from "@/block/InputLabel";
import Modal, { ModalPosition } from "@/components/modal/Modal";
import { State } from "@/hrm";
import { s } from "@/locales";
import { TbBinaryTree, TbX } from "solid-icons/tb";
import { Component } from "solid-js";

type GraphToolsModalProps = {
	onClose: () => void;
	state: State;
};

const GraphToolsModal: Component<GraphToolsModalProps> = props => {
	return (
		<Modal position={ModalPosition.Bottom} onClose={props.onClose}>
			{/* Body */}

			<h3> {s("graphTools.layout")} </h3>
			<Button color={Color.primary}>
				{s("graphTools.tool.layoutDefault")}{" "}
			</Button>
			<Button color={Color.secondary}>
				{s("graphTools.tool.layoutLinear")}{" "}
			</Button>

			<h3> {s("graphTools.optimization")} </h3>
			<Button color={Color.warning}>
				{s("graphTools.tool.selectUnreachables")}{" "}
			</Button>

			<h3> {s("graphTools.validate")} </h3>
			<Button color={Color.danger}>
				{s("graphTools.tool.validateGraph")}{" "}
			</Button>
		</Modal>
	);
};

export default GraphToolsModal;
