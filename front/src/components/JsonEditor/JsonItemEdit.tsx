import { useState } from 'react';

import * as jh from './helper';

import 'bootstrap/dist/css/bootstrap.css';

import './JsonEditor.css';

type JsonItemEditProps = {
  value: any,
  onModeClick: () => void,
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
      (value: string) => Number(value),
      props.onModeClick,
    );
  case jh.JsonType.STRING:
    return jsonLiteral(
      symbol,
      props.value,
      (value: string) => value,
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
