import { memo } from "react";
import { Handle, Position } from "reactflow";

export type ConstNodeProps = {
  data: any;
  isConnectable: boolean;
};

const shortenData = (data: any) => {
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return "[]";
    } else {
      return `[...] (#=${data.length})`;
    }
  } else if (typeof data === "object") {
    if (data === null) {
      return "null";
    } else {
      const keys = Object.keys(data);
      if (keys.length === 0) {
        return "{}";
      }
      const key = keys[0];
      return `{${key}:...}`;
    }
  } else if (typeof data === "string") {
    const MAX_LENGTH = 14;
    const z = JSON.stringify(data);
    if (z.length > MAX_LENGTH) {
      return `${z.slice(0, MAX_LENGTH - 3)}..."`;
    } else {
      return `${z}`;
    }
  } else {
    return String(data);
  }
};

const ConstNode = (props: ConstNodeProps) => {
  return (
    <>
      <div> {shortenData(props.data)} </div>
      <Handle
        id="ret"
        type="source"
        position={Position.Bottom}
        isConnectable={props.isConnectable}
      />
    </>
  );
};

const memoed = memo(ConstNode);

export default memoed;
