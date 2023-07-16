import React from "react";
import * as jh from "./helper";
import * as je from "./edit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faKey, faTrash } from "@fortawesome/free-solid-svg-icons";

export type JsonItemIndexProps = {
  path: jh.JsonPath;
  value: jh.Json;
  toggleIndex: () => void;
  updateEditing: (f: je.UpdateEdit) => void;
};

const JsonItemIndexEdit = React.memo((props: JsonItemIndexProps) => {
  const ref = React.useRef<HTMLInputElement>(null);
  const apply = () => {
    const input = ref.current;
    if (input === null) return;
    const oldKey = props.path[props.path.length - 1];
    const newKey: jh.JsonKey =
      typeof oldKey === "number" ? parseInt(input.value) : input.value;
    const actions = [
      new je.DeleteAction(props.path),
      new je.InsertAction(props.path.slice(0, -1).concat(newKey), props.value),
    ];
    props.updateEditing(je.applyJsonEdit(actions));
    props.toggleIndex();
  };
  const del = () => {
    props.updateEditing(je.applyJsonEdit([new je.DeleteAction(props.path)]));
    props.toggleIndex();
  };
  return (
    <div className="input-group mt-2">
      <span className="input-group-text py-1 px-2">
        <FontAwesomeIcon icon={faKey} />
      </span>
      <input
        ref={ref}
        type="text"
        className="form-control py-1 px-2"
        defaultValue={props.path[props.path.length - 1]}
        onBlur={() => {
          setTimeout(props.toggleIndex, 100);
        }}
        autoFocus
      />
      <button className="btn btn-danger py-1 px-2" type="button" onClick={del}>
        <FontAwesomeIcon icon={faTrash} />
      </button>
      <button
        className="btn btn-success py-1 px-2"
        type="button"
        onClick={apply}>
        <FontAwesomeIcon icon={faCheck} />
      </button>
    </div>
  );
});

export default JsonItemIndexEdit;
