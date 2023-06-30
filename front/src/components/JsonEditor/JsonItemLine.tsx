import { ReactElement } from "react";

import JsonItemIndex from "./JsonItemIndex";

type JsonItemLineProps = {
  depth: number;
  index: number | string;
  path: string;
  children: ReactElement | ReactElement[];
};

const JsonItemLine = (props: JsonItemLineProps) => {
  const style = {
    paddingLeft: `${props.depth * 2}px`,
  };
  return (
    <div className="json-item-line" style={style}>
      <JsonItemIndex
        index={props.index}
        path={props.path}
        updateIndex={() => {
          throw "Not implemented";
        }}
      />
      {props.children}
    </div>
  );
};

export default JsonItemLine;
