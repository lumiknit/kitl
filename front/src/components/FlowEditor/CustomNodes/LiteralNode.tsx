import { memo } from "react";
import { Handle, Position } from "reactflow";
import * as j from "../../../common/json";
import * as node from "../../../common/node";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHashtag,
  faQuoteLeft,
  faRectangleList,
  faSquare,
  faSquareCheck,
  faSquareXmark,
} from "@fortawesome/free-solid-svg-icons";

export type LiteralProps = {
  data: node.LiteralNodeData;
};

const Literal = (props: LiteralProps) => {
  const val = props.data.value;
  let icon = null;
  let body: any = null;
  switch (typeof val) {
    case "boolean":
      icon = val ? faSquareCheck : faSquareXmark;
      body = val ? "true" : "false";
      break;
    case "number":
      icon = faHashtag;
      body = val.toString();
      break;
    case "string":
      icon = faQuoteLeft;
      body = j.escapeString(val);
      break;
    case "object":
      if (val === null) {
        icon = faSquare;
        body = "null";
      } else {
        icon = faRectangleList;
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
        <div className="flow-node-container-icon">
          <FontAwesomeIcon className="fa-fw" icon={icon} />
        </div>
        <div className="flow-node-container-body">{body}</div>
      </div>
      <Handle
        id={node.HANDLE_LITERAL_RET}
        type="source"
        position={Position.Bottom}
        className="flow-handle-literal-ret"
      />
    </>
  );
};

export default memo(Literal);
