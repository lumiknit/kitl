import { ReactElement } from "react";

type JsonItemLineProps = {
  depth: number;
  children: ReactElement | ReactElement[];
};

const JsonItemLine = (props: JsonItemLineProps) => {
  const style = {
    paddingLeft: `${props.depth * 2}px`,
  };
  return (
    <div className="json-item-line" style={style}>
      {props.children}
    </div>
  );
};

export default JsonItemLine;
