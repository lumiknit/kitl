<<<<<<< HEAD
import { useMemo } from "react";
import * as jh from "./helper";
||||||| 3ee2a90
import { useState } from "react";
=======
import { createRef, useEffect } from "react";
>>>>>>> main

<<<<<<< HEAD
export type JsonItemIndexProps = {
  path: jh.JsonPath;
||||||| 3ee2a90
import "bootstrap/dist/css/bootstrap.css";

import "./JsonEditor.css";
import "./JsonIndent.css";

type JsonItemIndexProps = {
  index: number | string;
  path: string;
  updateIndex: (index: number | string) => void;
};

type JsonItemIndexState = {
  editing: boolean;
=======
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
>>>>>>> main
};

const JsonItemIndex = (props: JsonItemIndexProps) => {
<<<<<<< HEAD
  return useMemo(() => {
    return <div className="json-item-index">{jh.pathToString(props.path)}</div>;
  }, [props.path]);
||||||| 3ee2a90
  const [state, setState] = useState<JsonItemIndexState>({
    editing: false,
  });

  const discardChanges = () => {
    setState({
      editing: false,
    });
  };

  const updateIndex = () => {
    alert("updateIndex");
  };

  const removeIndex = () => {
    alert("removeIndex");
  };

  if (state.editing) {
    return (
      <div className="input-group">
        <span className="input-group-text py-1">
          <i className="bi bi-key" />
        </span>
        <input
          type="text"
          className="form-control py-1"
          defaultValue={props.index}
          onBlur={discardChanges}
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
        onClick={() => setState({ editing: true })}>
        &nbsp;{props.path}
      </div>
    );
  }
=======
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
>>>>>>> main
};

export default JsonItemIndex;
