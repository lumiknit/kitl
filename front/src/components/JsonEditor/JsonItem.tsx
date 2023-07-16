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
    return (
      <div className="json-item">
        <JsonItemIndex path={props.path} />
        <JsonItemValue
          path={props.path}
          value={props.value}
          updateEditing={props.updateEditing}
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
  }
);

export default JsonItem;
