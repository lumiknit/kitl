import { useState } from 'react';

import JsonItemType from './JsonItemType';
import JsonItem from './JsonItem';

import 'bootstrap/dist/css/bootstrap.css';
import './JsonEditor.css';

type JsonKey = number | string;
type JsonPath = JsonKey[];

type JsonEditorState = {
  value: any,
  cnt: number,
}

const JsonEditor = () => {
  const [state, setState] = useState<JsonEditorState>({
    value: null,
    cnt: 0,
  });
  
  const updateValue = (path: JsonPath, value: any) => {
    if(path.length === 0) {
      if(value === undefined) {
        value = null;
      }
      setState({
        value: value,
        cnt: state.cnt + 1,
      });
      return;
    }
    // Inplace update
    let current = state.value;
    for(let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    const key = path[path.length - 1];
    if(value !== undefined) {
      current[key] = value;
    } else if(Array.isArray(current)) {
      current.splice(Number(key), 1);
    } else {
      delete current[key];
    }
    setState({
      value: state.value,
      cnt: state.cnt + 1,
    });
  };

  return (
    <>
      <div className="json-editor">
        Test
        <JsonItem
          path={[0]}
          value={state.value}
          updateValue={updateValue} />
      </div>
    </>
  );
};

export default JsonEditor;
