
import { ReactElement, useState } from "react";
import { FlowContext } from "../FlowEditor/context";
import BrowserModal from "../Modal/BrowserModal";
import NodeEditorModal from "../NodeEditor/NodeEditorModal";


export enum ModalEditorType {
  Nothing = "nothing",
  NodeEditor = "nodeEditorModal",
  Browser = "browserModal",
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
  fullModal?: boolean;

  flowContext: FlowContext;
  setFlowContext: (flowContext: FlowContext) => void;

  onClose: (value: any) => void;

  children?: ReactElement | ReactElement[];
} & ModalProps;

type State = ModalProps;

const KitlModals = (props: Props) => {
  const [state, setState] = useState<State>(emptyModalProps);
  if(props.id !== state.id) {
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
  }
  return !props.fullModal ? modal : (
    <div className="editor-root-wide-item editor-root-wide-item-right full-modal">
      {modal}
    </div>
  );
};

export default KitlModals;