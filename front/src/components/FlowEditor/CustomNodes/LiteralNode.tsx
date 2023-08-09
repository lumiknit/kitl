import { memo } from "react";
import { Handle, Position } from "reactflow";
import * as cnh from "./helper";
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
  isConnectable: boolean;
};

const Literal = (props: LiteralProps) => {
  let inner = null;
  const val = props.data.value;
  switch (typeof val) {
    case "boolean":
      {
        if (val) {
          inner = (
            <div className="flow-node-container">
              <div className="flow-node-container-icon">
                <FontAwesomeIcon icon={faSquareCheck} />
              </div>
              <div className="flow-node-container-body">true</div>
            </div>
          );
        } else {
          inner = (
            <div className="flow-node-container">
              <div className="flow-node-container-icon">
                <FontAwesomeIcon icon={faSquareXmark} />
              </div>
              <div className="flow-node-container-body">false</div>
            </div>
          );
        }
      }
      break;
    case "number":
      {
        inner = (
          <div className="flow-node-container">
            <div className="flow-node-container-icon">
              <FontAwesomeIcon icon={faHashtag} />
            </div>
            <div className="flow-node-container-body">{val}</div>
          </div>
        );
      }
      break;
    case "string":
      {
        inner = (
          <div className="flow-node-container">
            <div className="flow-node-container-icon">
              <FontAwesomeIcon icon={faQuoteLeft} />
            </div>
            <div className="flow-node-container-body">
              {j.escapeString(val)}
            </div>
          </div>
        );
      }
      break;
    case "object":
      {
        if (val === null) {
          inner = (
            <div className="flow-node-container">
              <div className="flow-node-container-icon">
                <FontAwesomeIcon icon={faSquare} />
              </div>
              <div className="flow-node-container-body">null</div>
            </div>
          );
        } else {
          inner = (
            <div className="flow-node-container">
              <div className="flow-node-container-icon">
                <FontAwesomeIcon icon={faRectangleList} />
              </div>
              <div className="flow-node-container-body">
                <pre className="flow-node-container-raw">
                  {j.formatJsonCompact(val)}
                </pre>
              </div>
            </div>
          );
        }
      }
      break;
  }
  return (
    <>
      {inner}
      <Handle
        id={`ret`}
        type="source"
        position={Position.Bottom}
        isConnectable={props.isConnectable}
        className="flow-handle-literal-ret"
      />
    </>
  );
};

export default memo(Literal);
