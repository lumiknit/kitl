import { BsQuote } from "react-icons/bs";
import {
  Tb123,
  TbBraces,
  TbCircleDashed,
  TbCircleCheck,
  TbCircleOff,
} from "react-icons/tb";

import { memo } from "react";
import { Handle, Position } from "reactflow";
import * as j from "../../../common/json";
import * as node from "../../../common/node";

export type LiteralProps = {
  data: node.LiteralNodeData;
};

const Literal = (props: LiteralProps) => {
  const val = props.data.value;
  let icon = null;
  let body: any = null;
  switch (typeof val) {
    case "boolean":
      icon = val ? <TbCircleCheck /> : <TbCircleOff />;
      body = val ? "true" : "false";
      break;
    case "number":
      icon = <Tb123 />;
      body = val.toString();
      break;
    case "string":
      icon = <BsQuote />;
      body = j.escapeString(val);
      break;
    case "object":
      if (val === null) {
        icon = <TbCircleDashed />;
        body = "null";
      } else {
        icon = <TbBraces />;
        body = (
          <pre className="flow-node-container-raw">
            {j.formatJsonCompact(val)}
          </pre>
        );
      }
      break;
  }
  return (
    <>
      <div className="flow-node-container">
        <div className="flow-node-container-icon">{icon}</div>
        <div className="flow-node-container-body">{body}</div>
      </div>
      <Handle
        id={node.HANDLE_VAL}
        type="source"
        position={Position.Bottom}
        className="flow-handle-val flow-handle-border-color-literal"
      />
    </>
  );
};

export default memo(Literal);
