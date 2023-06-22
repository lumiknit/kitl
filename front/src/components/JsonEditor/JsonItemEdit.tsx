import { useState } from 'react';

import * as helper from './helper';

import 'bootstrap/dist/css/bootstrap.css';

import './JsonEditor.css';

type JsonItemEditProps = {
  value: any,
  onModeClick: () => void,
};

const JsonItemEdit = (props: JsonItemEditProps) => {

  const jsonType = helper.jsonTypeOf(props.value);
  const symbol = helper.jsonTypeSymbols[jsonType];

  return (
    <div className="input-group">
      <button type="button"
        className="btn btn-primary p-2"
        onClick={props.onModeClick}>
        {symbol}
      </button>
      <input type="text"
        className="form-control"
        defaultValue={props.value} />
    </div>
  );
};

export default JsonItemEdit;
