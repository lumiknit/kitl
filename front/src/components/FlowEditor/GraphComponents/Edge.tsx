import { BezierEdge, EdgeProps, Position } from "reactflow";
import * as node from "../../../common/node";

const DefaultEdge = (props: EdgeProps) => {
  const p = { ...props };
  const sourceHandleId = p.sourceHandleId;
  switch (sourceHandleId) {
    case node.HANDLE_VAL:
      {
        p.sourceY -= 4;
        const dx = props.sourceX - props.targetX;
        const dy = props.sourceY - props.targetY;
        if (dx < dy) {
          p.sourcePosition = Position.Right;
        } else {
          p.sourcePosition = Position.Bottom;
        }
      }
      break;
    case node.HANDLE_LAMBDA_PARAM:
      {
        p.sourceX += 4;
        const dx = props.sourceX - props.targetX;
        const dy = props.sourceY - props.targetY;
        if (dx < dy * 4) {
          p.sourcePosition = Position.Top;
        } else {
          p.sourcePosition = Position.Left;
        }
      }
      break;
  }
  return <BezierEdge {...p} />;
};

export default DefaultEdge;
