import { useState } from 'react';

import * as jh from './helper';
import JsonItemIndent from './JsonItemIndent';
import JsonItemEdit from './JsonItemEdit';
import JsonItemType from './JsonItemType';


import 'bootstrap/dist/css/bootstrap.css';

import './JsonEditor.css';

type JsonItemProps = {
  value: any,
  updateValue: (value: any) => void,
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

  const jsonType = jh.jsonTypeOf(state.value);

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
      newValue = jh.emptyJsonValueOfType(newType);
      // Update value contained in parent
      props.updateValue(newValue);
    }
    setState({
      value: newValue,
      mode: JsonItemMode.Edit,
    });
  };

  const updateValue = (value: any) => {
    state.value = value;
    props.updateValue(value);
  };

  let item;
  switch(state.mode) {
  case JsonItemMode.Edit:
    item = <JsonItemEdit
      value={state.value}
      onModeClick={enterTypeMode}
      updateValue={updateValue} />;
    break;
  case JsonItemMode.Type:
    item = <JsonItemType
      value={state.value}
      onTypeSelect={changeType} />;
    break;
  }
  return (
    <div className="json-item-line">
      <JsonItemIndent level={11} />
      {item}
    </div>
  );
};

export default JsonItem;
