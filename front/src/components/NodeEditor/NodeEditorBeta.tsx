import DefFinder from "../DefFinder/DefFinder";
import NodeEditorArgc from "./NodeEditorArgc";

import * as node from "../../common/node";
import * as d from "../../common/def";
import { Def } from "../../common/def";
import { ChangeEvent } from "react";

export type NodeEditorBetaProps = {
  value: node.BetaNodeData;
  updateValue: (value: node.NodeData) => void;
};

const NodeEditorBeta = (props: NodeEditorBetaProps) => {
  let inner = null;
  if (props.value.betaType === node.BetaNodeType.Name) {
    const val = props.value as node.BetaNodeName;
    const onDefChange = (value: Def) => {
      props.updateValue({
        ...val,
        name: {
          name: value.name,
          module: value.module,
        },
      });
    };
    inner = (
      <>
        <DefFinder
          defaultValue={d.newDef(
            d.DefType.Value,
            val.name.name,
            val.name.module,
          )}
          onChange={onDefChange}
        />
      </>
    );
  }
  const onUseNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const val = props.value as {
        name?: node.Name;
      };
      const name =
        val.name === undefined
          ? {
              name: ".",
              module: "",
            }
          : val.name;
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
  return (
    <>
      <h3> β (Fn Call / Application) </h3>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="useNameCheck"
          defaultChecked={props.value.betaType === node.BetaNodeType.Name}
          onChange={onUseNameChange}
        />
        <label className="form-check-label" htmlFor="useNameCheck">
          Use Named Value
        </label>
      </div>
      <NodeEditorArgc defaultValue={props.value.argc} readonly />
      {inner}
    </>
  );
};

export default NodeEditorBeta;
