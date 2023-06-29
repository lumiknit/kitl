import { useState } from "react";

import * as jh from "./helper";
import * as jc from "./config";
import JsonItemEdit from "./JsonItemEdit";
import JsonItemType from "./JsonItemType";

import "bootstrap/dist/css/bootstrap.css";

import "./JsonEditor.css";
import "./JsonIndent.css";

type JsonItemProps = {
  depth?: number;
  index: number | string;
  value: jh.Json;
  updateValue: (value: jh.Json) => void;
  config: jc.Config;
};

enum JsonItemMode {
  Edit,
  Type,
}

const JsonItem = (props: JsonItemProps) => {
  const depth = props.depth ?? 0;
  const [state, setState] = useState({
    value: props.value,
    mode: JsonItemMode.Edit,
    cnt: 0,
  });

  const jsonType = jh.jsonTypeOf(state.value);

  const enterTypeMode = () => {
    setState({
      value: state.value,
      mode: JsonItemMode.Type,
      cnt: state.cnt,
    });
  };

  const changeType = (newType: number) => {
    // Check mode into Edit
    console.log(newType);
    let newValue = state.value;
    if (newType !== jsonType) {
      newValue = jh.emptyJsonValueOfType(newType);
      // Update value contained in parent
      props.updateValue(newValue);
    }
    setState({
      value: newValue,
      mode: JsonItemMode.Edit,
      cnt: state.cnt,
    });
  };

  const updateValue = (value: jh.Json, render?: boolean) => {
    state.value = value;
    props.updateValue(value);
    if (render) {
      setState({
        value: state.value,
        mode: state.mode,
        cnt: state.cnt + 1,
      });
    }
  };

  let content = null;
  switch (state.mode) {
    case JsonItemMode.Edit:
      content = (
        <JsonItemEdit
          depth={depth}
          index={props.index}
          value={state.value}
          onModeClick={enterTypeMode}
          updateValue={updateValue}
        />
      );
      break;
    case JsonItemMode.Type:
      content = (
        <JsonItemType
          depth={depth}
          index={props.index}
          value={state.value}
          onTypeSelect={changeType}
        />
      );
      break;
  }
  return content;
};

export default JsonItem;
