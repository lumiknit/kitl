import { TbBinaryTree } from "react-icons/tb";
import Modal from "./Modal";
import ModalHeader from "./ModalHeader";
import i18n from "../../locales/i18n";

type GraphToolsModalProps = {
  open: boolean;
  onClose?: (tool: string) => void;
};

const Btn = (props: {
  color: string;
  toolName: string;
  onClose?: (tool: string) => void;
}) => {
  return (
    <button
      className={`btn btn-${props.color}`}
      onClick={() => props.onClose?.(props.toolName)}>
      {i18n.t(`graphTools.tool.${props.toolName}`)}
    </button>
  );
};

const GraphToolsModal = (props: GraphToolsModalProps) => {
  return (
    <Modal open={props.open} onClose={() => props.onClose?.("")}>
      <ModalHeader
        icon={<TbBinaryTree />}
        title="Graph Tools"
        onClose={() => props.onClose?.("")}
      />
      <h3>{i18n.t("graphTools.layout")}</h3>

      <Btn color="primary" toolName="layoutDefault" onClose={props.onClose} />
      <Btn color="secondary" toolName="layoutLinear" onClose={props.onClose} />

      <h3>{i18n.t("graphTools.optimization")}</h3>

      <Btn
        color="warning"
        toolName="selectUnreachables"
        onClose={props.onClose}
      />

      <h3>{i18n.t("graphTools.validate")}</h3>
      <Btn color="primary" toolName="validateGraph" onClose={props.onClose} />
    </Modal>
  );
};

export default GraphToolsModal;
