import React from "react";
import * as jh from "./helper";
import * as je from "./edit";
import JsonItemIndex from "./JsonItemIndex";
import JsonItemValue from "./JsonItemValue";

export type JsonItemProps = {
  path: jh.JsonPath;
  value: jh.Json;
  updateEditing: (f: je.UpdateEdit) => void;
};

const JsonItem = React.memo(
  (props: JsonItemProps) => {
    const [state, setState] = React.useState({
      editingIndex: false,
    });
    const toggleIndex = React.useCallback(() => {
      setState({
        ...state,
        editingIndex: !state.editingIndex,
      });
    }, [state]);
    return (
      <div className="json-item">
        <JsonItemIndex
          path={props.path}
          value={props.value}
          editing={state.editingIndex}
          toggleIndex={toggleIndex}
          updateEditing={props.updateEditing}
        />
        <JsonItemValue
          path={props.path}
          value={props.value}
          updateEditing={props.updateEditing}
          toggleIndex={toggleIndex}
        />
      </div>
    );
  },
  (prev, next) => {
    return (
      prev.value === next.value &&
      prev.path.length === next.path.length &&
      prev.path.every((v, i) => v === next.path[i])
    );
  },
);

export default JsonItem;
