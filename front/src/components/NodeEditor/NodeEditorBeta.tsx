import DefFinder from "../DefFinder/DefFinder";
import NodeEditorArgc from "./NodeEditorArgc";

import * as node from "../../common/node";
import * as d from "../../common/def";
import { Def } from "../../common/def";
import { ChangeEvent } from "react";
import { newName } from "../../common/name";

export type NodeEditorBetaProps = {
  value: node.BetaNodeData;
  updateValue: (value: node.NodeData) => void;
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
      props.updateValue({
        ...props.value,
        betaType: node.BetaNodeType.Name,
        name: name,
      });
    } else {
      props.updateValue({
        ...props.value,
        betaType: node.BetaNodeType.App,
      });
    }
  };
  const onDefChange = (value: Def) => {
    if (value.name === "") {
      props.updateValue({
        ...props.value,
        betaType: node.BetaNodeType.App,
      });
    } else {
      props.updateValue({
        ...props.value,
        betaType: node.BetaNodeType.Name,
        name: value,
      });
    }
  };
  return (
    <>
      <h3> β (Fn Call / Application) </h3>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="useNameCheck"
          checked={props.value.betaType === node.BetaNodeType.Name}
          onChange={onUseNameChange}
        />
        <label className="form-check-label" htmlFor="useNameCheck">
          Use Named Value
        </label>
      </div>
      <NodeEditorArgc
        defaultValue={props.value.argc}
        onChange={argc => {
          props.updateValue({
            ...props.value,
            argc,
          });
        }}
      />
      <DefFinder
        value={d.newDef(d.DefType.Value, name.name, name.module)}
        onChange={onDefChange}
      />
    </>
  );
};

export default NodeEditorBeta;
