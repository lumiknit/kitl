import DefFinder from "../DefFinder/DefFinder";
import NodeEditorArgc from "./NodeEditorArgc";

import * as node from "../../common/node";
import * as d from "../../common/def";
import { Def } from "../../common/def";
import { ChangeEvent } from "react";
import { newName } from "../../common/name";

export type NodeEditorLambdaProps = {
  value: node.LambdaNodeData;
  updateValue: (value: node.NodeData) => void;
};

const NodeEditorLambda = (props: NodeEditorLambdaProps) => {
  let pattern: node.Name;
  let argc: number;
  if (props.value.lambdaType === node.LambdaNodeType.Pattern) {
    const val = props.value as node.LambdaPatternNodeData;
    pattern = val.pattern;
    argc = val.argc;
  } else {
    pattern = newName("", "");
    argc = 0;
  }

  const onPatternChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const val = props.value as {
        argc?: number;
        pattern?: node.Name;
      };
      const argc = val.argc === undefined ? 0 : val.argc;
      const pattern =
        val.pattern === undefined ? newName(".", "") : val.pattern;
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
  const onArgcChange = (value: number) => {
    props.updateValue({
      ...props.value,
      lambdaType: node.LambdaNodeType.Pattern,
      argc: value,
      pattern: pattern,
    });
  };
  const onDefChange = (value: Def) => {
    if (value.name === "") {
      props.updateValue({
        ...props.value,
        lambdaType: node.LambdaNodeType.Any,
      });
    } else {
      props.updateValue({
        ...props.value,
        lambdaType: node.LambdaNodeType.Pattern,
        argc: argc,
        pattern: value,
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
          checked={props.value.lambdaType === node.LambdaNodeType.Pattern}
          onChange={onPatternChange}
        />
        <label className="form-check-label" htmlFor="flexCheckDefault">
          Lambda with Pattern
        </label>
      </div>
      <NodeEditorArgc
        defaultValue={argc}
        onChange={onArgcChange}
        readonly={props.value.lambdaType === node.LambdaNodeType.Any}
      />
      <DefFinder
        value={d.newDef(d.DefType.Value, pattern.name, pattern.module)}
        onChange={onDefChange}
      />
    </>
  );
};

export default NodeEditorLambda;
