import DefFinder from "../DefFinder/DefFinder";
import NodeEditorArgc from "./NodeEditorArgc";

import * as node from "../../common/node";
import * as def from "../../common/def";
import { Def } from "../../common/def";
import { ChangeEvent } from "react";
import { newName } from "../../common/name";
import i18n from "../../locales/i18n";

export type NodeEditorBetaProps = {
  value: node.BetaNodeData;
  onChange: (value: node.NodeData) => void;
  onReturnKey?: () => void;
};

const NodeEditorBeta = (props: NodeEditorBetaProps) => {
  let name: node.Name;
  if (props.value.betaType === node.BetaNodeType.Name) {
    name = (props.value as node.BetaNameNodeData).name;
  } else {
    name = newName("", "");
  }
  const onUseNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const val = props.value as {
        name?: node.Name;
      };
      const name = val.name === undefined ? newName(".", "") : val.name;
      props.onChange({
        ...props.value,
        betaType: node.BetaNodeType.Name,
        name: name,
      });
    } else {
      props.onChange({
        ...props.value,
        betaType: node.BetaNodeType.App,
      });
    }
  };
  const onDefChange = (value: Def) => {
    if (value.name === "") {
      props.onChange({
        ...props.value,
        betaType: node.BetaNodeType.App,
      });
    } else {
      props.onChange({
        ...props.value,
        betaType: node.BetaNodeType.Name,
        name: value,
      });
    }
  };
  return (
    <>
      <h3> {i18n.t("nodeEditor.common.beta")} </h3>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="useNameCheck"
          checked={props.value.betaType === node.BetaNodeType.Name}
          onChange={onUseNameChange}
        />
        <label className="form-check-label" htmlFor="useNameCheck">
          {i18n.t("nodeEditor.beta.withName")}
        </label>
      </div>
      <NodeEditorArgc
        defaultValue={props.value.argc}
        onChange={argc => {
          props.onChange({
            ...props.value,
            argc,
          });
        }}
        onReturnKey={props.onReturnKey}
      />
      <DefFinder
        value={def.newDef(def.DefType.Value, name.name, name.module)}
        onChange={onDefChange}
        onReturnKey={props.onReturnKey}
        autoFocus={true}
      />
    </>
  );
};

export default NodeEditorBeta;
