import { BezierEdge, EdgeProps, Position } from "reactflow";

const DefaultEdge = (props: EdgeProps) => {
  const p = { ...props };
  const sourceHandleId = p.sourceHandleId;
  if (sourceHandleId && sourceHandleId.endsWith("val")) {
    p.sourceY -= 4;
    const dx = props.sourceX - props.targetX;
    const dy = props.sourceY - props.targetY;
    if (dx < dy) {
      p.sourcePosition = Position.Right;
    } else {
      p.sourcePosition = Position.Bottom;
    }
  }
  return <BezierEdge {...p} />;
};

export default DefaultEdge;
