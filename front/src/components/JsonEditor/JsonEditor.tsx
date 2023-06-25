import { useState } from 'react';

import '@popperjs/core';
import 'bootstrap/dist/js/bootstrap.bundle';

import JsonEditorHeader from './JsonEditorHeader';
import JsonItemType from './JsonItemType';
import JsonItem from './JsonItem';
import JsonTextArea from './JsonTextArea';
import * as jh from './helper';

import 'bootstrap/dist/css/bootstrap.css';

import './JsonEditor.css';

type JsonEditorState = {
  mode: jh.EditMode,
  valueBox: any[1],
  cnt: number,
}

const JsonEditor = () => {
  const [state, setState] = useState<JsonEditorState>({
    mode: jh.EditMode.Tree,
    valueBox: [null],
    cnt: 0,
  });

  const updateValue = (value: any) => {
    state.valueBox[0] = value;
    console.log("JsonEditor.updateValue", value);
  };

  const updateMode = (mode: jh.EditMode) => {
    const newState = {...state};
    newState.mode = mode;
    setState(newState);
  };

  return (
    <div className="test-wrap">
    <div className="json-editor">
      <JsonEditorHeader
        mode={state.mode}
        updateMode={updateMode}
      />
      <div className="json-editor-body">
        { jh.isTextMode(state.mode) ?
          <JsonTextArea
            value={state.valueBox[0]}
            updateValue={updateValue} /> :
          <JsonItem
            value={state.valueBox[0]}
            updateValue={updateValue} />
        }
      </div>
    </div>
    </div>
  );
};

export default JsonEditor;
