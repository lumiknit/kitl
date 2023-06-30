import { ReactElement } from "react";

import * as jh from "./helper";
import JsonItemIndex from "./JsonItemIndex";

type JsonItemLineProps = {
  position: jh.Position;
  children: ReactElement | ReactElement[];
};

const JsonItemLine = (props: JsonItemLineProps) => {
  const style = {
    paddingLeft: `${props.position.depth * 2}px`,
  };
  return (
    <div className="json-item-line" style={style}>
      <JsonItemIndex
        index={props.position.index}
        path={props.position.path}
        updateIndex={() => {
          throw "Not implemented";
        }}
      />
      {props.children}
    </div>
  );
};

export default JsonItemLine;
