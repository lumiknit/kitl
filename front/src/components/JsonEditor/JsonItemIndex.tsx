import { createRef, useEffect } from "react";

import "bootstrap/dist/css/bootstrap.css";

import "./JsonEditor.css";
import "./JsonIndent.css";

export type JsonItemIndexProps = {
  index: number | string;
  path: string;
  editing: boolean;
  updateEditing: (editing: boolean) => void;
  updateIndex: (
    oldIndex: number | string,
    newIndex: number | string | undefined
  ) => void;
};

const JsonItemIndex = (props: JsonItemIndexProps) => {
  const refInput = createRef<HTMLInputElement>();

  const updateIndex = () => {
    const oldIndex = props.index;
    const newIndex = refInput.current?.value;
    if (newIndex !== "") {
      // Ignore empty index
      props.updateIndex(oldIndex, newIndex);
    }
    props.updateEditing(false);
  };

  const removeIndex = () => {
    const oldIndex = props.index;
    props.updateIndex(oldIndex, undefined);
    props.updateEditing(false);
  };

  useEffect(() => {
    const input = refInput.current;
    if (input === null) return;
    input.selectionStart = 0;
    input.selectionEnd = input.value.length;
  });

  if (props.editing) {
    return (
      <div className="input-group">
        <span className="input-group-text py-1">
          <i className="bi bi-key" />
        </span>
        <input
          ref={refInput}
          type="text"
          className="form-control py-1"
          defaultValue={props.index}
          placeholder={String(props.index)}
          autoFocus
        />
        <button
          className="btn btn-danger py-1"
          type="button"
          onClick={removeIndex}>
          <i className="bi bi-trash" />
        </button>
        <button
          className="btn btn-success py-1"
          type="button"
          onClick={updateIndex}>
          <i className="bi bi-check" />
        </button>
      </div>
    );
  } else {
    return (
      <div
        className="json-item-index text-truncate"
        onClick={() => props.updateEditing(true)}>
        &nbsp;{props.path}
      </div>
    );
  }
};

export default JsonItemIndex;
