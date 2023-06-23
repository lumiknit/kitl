import { useState } from 'react';

import * as jh from './helper';

import 'bootstrap/dist/css/bootstrap.css';

import './JsonEditor.css';

type JsonItemEditProps = {
  value: any,
  onModeClick: () => void,
  updateValue: (value: any) => void,
};

const jsonConst = (name: string, onModeClick: () => void) => (
  <div className="input-group">
    <button type="button"
      className="btn btn-primary p-2"
      onClick={onModeClick}>
      {name}
    </button>
  </div>
);

const jsonLiteral = (
  symbol: string,
  value: any,
  parse: (value: string) => any,
  onModeClick: () => void,
) => {
  const onInput = (event: React.FormEvent<HTMLInputElement>) => {
    const newValue = parse(event.currentTarget.value);
    console.log(newValue);
  };
  return (
    <div className="input-group">
      <button type="button"
        className="btn btn-primary p-2"
        onClick={onModeClick}>
        {symbol}
      </button>
      <input type="text"
        className="form-control"
        onInput={onInput}
        defaultValue={value} />
    </div>
  );
};

const JsonItemEdit = (props: JsonItemEditProps) => {
  const jsonType = jh.jsonTypeOf(props.value);
  const symbol = jh.jsonTypeSymbols[jsonType];

  const updateNumber = (value: string) => {
    const newValue = Number(value);
    if(isNaN(newValue)) {
      return;
    }
    props.updateValue(newValue);
  };

  const updateString = (value: string) => {
    props.updateValue(value);
  }

  switch(jsonType) {
  case jh.JsonType.NULL:
    return jsonConst('null', props.onModeClick);
  case jh.JsonType.FALSE:
    return jsonConst('false', props.onModeClick);
  case jh.JsonType.TRUE:
    return jsonConst('true', props.onModeClick);
  case jh.JsonType.NUMBER:
    return jsonLiteral(
      symbol,
      props.value,
      updateNumber,
      props.onModeClick,
    );
  case jh.JsonType.STRING:
    return jsonLiteral(
      symbol,
      props.value,
      updateString,
      props.onModeClick,
    );
  default:
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
  }
};

export default JsonItemEdit;
