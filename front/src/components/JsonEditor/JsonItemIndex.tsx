import { useState } from "react";

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
};

const JsonItemIndex = (props: JsonItemIndexProps) => {
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
          onClick={removeIndex}
        >
          <i className="bi bi-trash" />
        </button>
        <button
          className="btn btn-success py-1"
          type="button"
          onClick={updateIndex}
        >
          <i className="bi bi-check" />
        </button>
      </div>
    );
  } else {
    return (
      <div
        className="json-item-index text-truncate"
        onClick={() => setState({ editing: true })}
      >
        &nbsp;{props.path}
      </div>
    );
  }
};

export default JsonItemIndex;
