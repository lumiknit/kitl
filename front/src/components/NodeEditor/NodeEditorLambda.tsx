import DefFinder from "../DefFinder/DefFinder";
import NodeEditorArgc from "./NodeEditorArgc";

import * as node from "../../common/node";
import * as d from "../../common/def";
import { Def } from "../../common/def";
import { ChangeEvent } from "react";

export type NodeEditorLambdaProps = {
  value: node.LambdaNodeData;
  updateValue: (value: node.NodeData) => void;
};

const NodeEditorLambda = (props: NodeEditorLambdaProps) => {
  let inner = null;
  if (props.value.lambdaType === node.LambdaNodeType.Pattern) {
    const val = props.value as node.LambdaPatternNodeData;
    const onArgcChange = (value: number) => {
      props.updateValue({
        ...val,
        argc: value,
      });
    };
    const onDefChange = (value: Def) => {
      props.updateValue({
        ...val,
        pattern: {
          name: value.name,
          module: value.module,
        },
      });
    };
    inner = (
      <>
        <NodeEditorArgc
          defaultValue={props.value.argc}
          onChange={onArgcChange}
        />
        <DefFinder
          defaultValue={d.newDef(
            d.DefType.Value,
            val.pattern.name,
            val.pattern.module,
          )}
          onChange={onDefChange}
        />
      </>
    );
  }
  const onPatternChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const val = props.value as {
        argc?: number;
        pattern?: node.Name;
      };
      const argc = val.argc === undefined ? 0 : val.argc;
      const pattern =
        val.pattern === undefined
          ? {
              name: ".",
              module: "",
            }
          : val.pattern;
      props.updateValue({
        ...props.value,
        lambdaType: node.LambdaNodeType.Pattern,
        argc: argc,
        pattern: pattern,
      });
    } else {
      props.updateValue({
        ...props.value,
        lambdaType: node.LambdaNodeType.Any,
      });
    }
  };
  return (
    <>
      <h3> λ (Fn Def / Abstraction) </h3>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="flexCheckDefault"
          defaultChecked={
            props.value.lambdaType === node.LambdaNodeType.Pattern
          }
          onChange={onPatternChange}
        />
        <label className="form-check-label" htmlFor="flexCheckDefault">
          Lambda with Pattern
        </label>
      </div>
      {inner}
    </>
  );
};

export default NodeEditorLambda;
