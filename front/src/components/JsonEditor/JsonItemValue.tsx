import { useState } from "react";
import * as jh from "./helper";

import JsonItemValueType from "./JsonItemValueType";
import JsonItemValueShow from "./JsonItemValueShow";
import { useJsonEditorContext } from "./JsonEditorProvider";

export type JsonItemValueProps = {
  path: jh.JsonPath;
  value: jh.Json;
};

const JsonItemValue = (props: JsonItemValueProps) => {
  const ty = jh.jsonTypeOf(props.value);
  const ctx = useJsonEditorContext();
  const [state, setState] = useState({
    editingType: false,
  });
  const changeType = (toggle: boolean, newType?: jh.JsonType) => {
    if (toggle) {
      setState({
        editingType: !state.editingType,
      });
    }
    if (newType !== undefined && newType !== ty) {
      ctx.value.edit.update(props.path, jh.emptyJsonValueOfType(newType));
      ctx.updated();
    }
  };

  if (state.editingType) {
    return (
      <JsonItemValueType
        path={props.path}
        value={props.value}
        changeType={changeType}
      />
    );
  } else {
    return (
      <JsonItemValueShow
        path={props.path}
        value={props.value}
        changeType={changeType}
      />
    );
  }
};

export default JsonItemValue;
