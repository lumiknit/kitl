import * as jh from "./helper";
import * as je from "./edit";
import JsonItemIndexEdit from "./JsonItemIndexEdit";
import JsonItemIndexShow from "./JsonItemIndexShow";

export type JsonItemIndexProps = {
  path: jh.JsonPath;
  value: jh.Json;
  editing: boolean;
  toggleIndex: () => void;
  updateEditing: (f: je.UpdateEdit) => void;
};

const JsonItemIndex = (props: JsonItemIndexProps) => {
  if (props.editing) {
    return (
      <JsonItemIndexEdit
        path={props.path}
        value={props.value}
        toggleIndex={props.toggleIndex}
        updateEditing={props.updateEditing}
      />
    );
  } else {
    return (
      <JsonItemIndexShow path={props.path} toggleIndex={props.toggleIndex} />
    );
  }
};

export default JsonItemIndex;
