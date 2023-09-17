import { ReactElement, useState } from "react";
import { FlowContext } from "../FlowEditor/context";
import BrowserModal from "../Browser/BrowserModal";
import NodeEditorModal from "../NodeEditor/NodeEditorModal";
import GraphToolsModal from "../Modal/GraphToolsModal";

export enum ModalEditorType {
  Nothing = "nothing",
  NodeEditor = "nodeEditorModal",
  Browser = "browserModal",
  GraphTools = "graphToolsModal",
}

export type ModalProps = {
  id: string;
  type: ModalEditorType;
  path: string;
  defaultValue: any;
};

export const emptyModalProps = () => ({
  id: "",
  type: ModalEditorType.Nothing,
  path: "",
  defaultValue: null,
});

type Props = {
  flowContext: FlowContext;
  setFlowContext: (flowContext: FlowContext) => void;

  onClose: (value: any) => void;

  children?: ReactElement | ReactElement[];
} & ModalProps;

type State = ModalProps;

const KitlModals = (props: Props) => {
  const [state, setState] = useState<State>(emptyModalProps);
  if (props.id !== state.id) {
    setState({
      id: props.id,
      type: props.type,
      path: props.path,
      defaultValue: props.defaultValue,
    });
  }

  let modal = null;
  switch (state.type) {
    case ModalEditorType.NodeEditor:
      modal = (
        <NodeEditorModal
          open={true}
          onClose={props.onClose}
          path={state.path}
          defaultValue={state.defaultValue}
        />
      );
      break;
    case ModalEditorType.Browser:
      modal = (
        <BrowserModal
          open={true}
          onClose={props.onClose}
          path={state.path}
          defaultValue={state.defaultValue}
        />
      );
      break;
    case ModalEditorType.GraphTools:
      modal = <GraphToolsModal open={true} onClose={props.onClose} />;
      break;
  }
  return modal;
};

export default KitlModals;
