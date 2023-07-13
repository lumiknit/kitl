import * as jh from "./helper";
import JsonItemIndex from "./JsonItemIndex";
import JsonItemValue from "./JsonItemValue";

<<<<<<< HEAD
export type JsonItemProps = {
  path: jh.JsonPath;
||||||| 3ee2a90
import "bootstrap/dist/css/bootstrap.css";

import "./JsonEditor.css";
import "./JsonIndent.css";

type JsonItemProps = {
  position: jh.Position;
=======
import "bootstrap/dist/css/bootstrap.css";

import "./JsonEditor.css";
import "./JsonIndent.css";

export type UpdateIndexFn = (
  oldIndex: number | string,
  newIndex: number | string | undefined
) => void;

export type JsonItemProps = {
  position: jh.Position;
  updateIndex: UpdateIndexFn;
>>>>>>> main
  value: jh.Json;
};

const JsonItem = (props: JsonItemProps) => {
<<<<<<< HEAD
  return (
    <div className="json-item">
      <JsonItemIndex path={props.path} />
      <JsonItemValue path={props.path} value={props.value} />
    </div>
  );
||||||| 3ee2a90
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
          position={props.position}
          value={state.value}
          onModeClick={enterTypeMode}
          updateValue={updateValue}
          config={props.config}
        />
      );
      break;
    case JsonItemMode.Type:
      content = (
        <JsonItemType
          position={props.position}
          value={state.value}
          onTypeSelect={changeType}
        />
      );
      break;
  }
  return content;
=======
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
          position={props.position}
          updateIndex={props.updateIndex}
          value={state.value}
          onModeClick={enterTypeMode}
          updateValue={updateValue}
          config={props.config}
        />
      );
      break;
    case JsonItemMode.Type:
      content = (
        <JsonItemType
          position={props.position}
          updateIndex={props.updateIndex}
          value={state.value}
          onTypeSelect={changeType}
        />
      );
      break;
  }
  return content;
>>>>>>> main
};

export default JsonItem;
