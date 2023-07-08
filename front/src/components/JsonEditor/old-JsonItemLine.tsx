import { ReactElement } from "react";

import * as jh from "./helper";
import { UpdateIndexFn } from "./JsonItem";
import JsonItemIndex from "./JsonItemIndex";

export type JsonItemLineProps = {
  position: jh.Position;
  updateIndex: UpdateIndexFn;
  editingIndex: boolean;
  updateEditingIndex: (editing: boolean) => void;
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
        updateIndex={props.updateIndex}
        editing={props.editingIndex}
        updateEditing={props.updateEditingIndex}
      />
      {props.children}
    </div>
  );
};

export default JsonItemLine;
