import { useState } from 'react';

import JsonItemType from './JsonItemType';
import JsonItem from './JsonItem';
import * as jh from './helper';

import 'bootstrap/dist/css/bootstrap.css';
import './JsonEditor.css';

type JsonEditorState = {
  valueBox: any[],
  cnt: number,
}

const JsonEditor = () => {
  const [state, setState] = useState<JsonEditorState>({
    valueBox: [null],
    cnt: 0,
  });

  const alertValue = () => {
    alert(state.valueBox[0]);
  };

  const updateValue = (value: any) => {
    state.valueBox[0] = value;
    console.log("JsonEditor.updateValue", value);
  };

  return (
    <>
      <div className="json-editor">
        <button type="button"
          className="btn btn-danger p-2 m-2"
          onClick={alertValue}>
          Alert
        </button>
        <JsonItem
          value={state.valueBox[0]}
          updateValue={updateValue} />
      </div>
    </>
  );
};

export default JsonEditor;
