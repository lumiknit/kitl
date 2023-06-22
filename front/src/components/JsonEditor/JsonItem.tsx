import { useState } from 'react';

import * as helper from './helper';
import JsonItemEdit from './JsonItemEdit';
import JsonItemType from './JsonItemType';


import 'bootstrap/dist/css/bootstrap.css';

import './JsonEditor.css';

type JsonItemProps = {
  value: any,
};

enum JsonItemMode {
  Edit,
  Type,
}

const JsonItem = (props: JsonItemProps) => {
  const [state, setState] = useState({
    value: props.value,
    mode: JsonItemMode.Edit,
  });

  const jsonType = helper.jsonTypeOf(state.value);
  const symbol = helper.jsonTypeSymbols[jsonType];

  const enterTypeMode = () => {
    setState({
      value: state.value,
      mode: JsonItemMode.Type,
    });
  };

  const changeType = (newType: number) => {
    // Check mode into Edit
    console.log(newType);
    let newValue = state.value;
    if(newType !== jsonType) {
      newValue = helper.emptyJsonValueOfType(newType);
    }
    setState({
      value: newValue,
      mode: JsonItemMode.Edit,
    });
  };

  switch(state.mode) {
  case JsonItemMode.Edit: return (
    <JsonItemEdit
      value={state.value}
      onModeClick={enterTypeMode} />
  );
  case JsonItemMode.Type: return (
    <JsonItemType
      value={state.value}
      onTypeSelect={changeType} />
  );
  }
};

export default JsonItem;
