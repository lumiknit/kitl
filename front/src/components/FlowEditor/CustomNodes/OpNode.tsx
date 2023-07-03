import { memo } from "react";
import { Handle, Position } from "reactflow";

type OpNodeProps = {
  data: string;
  isConnectable: boolean;
};

const opNameSymbol: { [key: string]: string } = {
  "->": "→",
  "<-": "←",
  "<->": "↔",
  "=>": "⇒",
  ">=": "≥",
  "<=": "≤",
  "==": "=",
  "!=": "≠",
  "+-": "±",
  "++": "++",
  "_|_": "⊥",
  "&&": "∧",
  "||": "∨",
  "!!": "‼",
  "|>": "▷",
  "<|": "◁",
  "<-<": "↢",
  ">->": "↣",
  "-<": "⤙",
  ">-": "⤚",
  "><": "⋈",
}

const OpNode = (props: OpNodeProps) => {
  return (
    <>
      <Handle
        id="ctx"
        type="target"
        position={Position.Left}
        onConnect={params => console.log("handle onConnect", params)}
        isConnectable={props.isConnectable}
      />
      <Handle
        id="arg"
        type="target"
        position={Position.Top}
        onConnect={params => console.log("handle onConnect", params)}
        isConnectable={props.isConnectable}
      />
      <div> {
        opNameSymbol[props.data] !== undefined ?
        opNameSymbol[props.data] :
        props.data
      } </div>
      <Handle
        id="clo"
        type="source"
        position={Position.Right}
        isConnectable={props.isConnectable}
      />
      <Handle
        id="ret"
        type="source"
        position={Position.Bottom}
        isConnectable={props.isConnectable}
      />
    </>
  );
};

const memoed = memo(OpNode);

export default memoed;
