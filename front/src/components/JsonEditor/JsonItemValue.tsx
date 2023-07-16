import React, { useCallback, useState } from "react";
import * as je from "./edit";
import * as jh from "./helper";

import JsonItemValueType from "./JsonItemValueType";
import JsonItemValueShow from "./JsonItemValueShow";

export type JsonItemValueProps = {
  path: jh.JsonPath;
  value: jh.Json;
  updateEditing: (f: je.UpdateEdit) => void;
};

const JsonItemValue = React.memo((props: JsonItemValueProps) => {
  const [state, setState] = useState({
    editingType: false,
    editingIndex: false,
  });

  const toggleType = useCallback(() => {
    setState({
      ...state,
      editingType: !state.editingType,
    });
  }, [state]);

  const toggleIndex = useCallback(() => {
    setState({
      ...state,
      editingIndex: !state.editingIndex,
    });
  }, [state]);

  if (state.editingType) {
    return (
      <JsonItemValueType
        path={props.path}
        value={props.value}
        updateEditing={props.updateEditing}
        toggleType={toggleType}
        toggleIndex={toggleIndex}
      />
    );
  } else {
    return (
      <JsonItemValueShow
        path={props.path}
        value={props.value}
        updateEditing={props.updateEditing}
        toggleType={toggleType}
        toggleIndex={toggleIndex}
      />
    );
  }
});

export default JsonItemValue;
