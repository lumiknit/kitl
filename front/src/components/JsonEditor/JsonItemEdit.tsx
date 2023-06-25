import { useState } from 'react';

import * as jh from './helper';
import BI from '../Util/BI';
import JsonItem from './JsonItem';

import 'bootstrap/dist/css/bootstrap.css';

import './JsonEditor.css';

type JsonItemEditProps = {
  value: any,
  onModeClick: () => void,
  updateValue: (value: any) => void,
};

const jsonConst = (icon: any, onModeClick: () => void) => (
  <div className="input-group">
    <button type="button"
      className="btn btn-primary p-2"
      onClick={onModeClick}>
      {icon}
    </button>
  </div>
);

const jsonLiteral = (
  icon: any,
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
        {icon}
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
  const icon = <BI iconName={jh.jsonTypeIcons[jsonType]} />;

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

  let line;

  switch(jsonType) {
  case jh.JsonType.NULL:
  case jh.JsonType.FALSE:
  case jh.JsonType.TRUE:
    return jsonConst(icon, props.onModeClick);
  case jh.JsonType.NUMBER:
    return jsonLiteral(
      icon,
      props.value,
      updateNumber,
      props.onModeClick,
    );
  case jh.JsonType.STRING:
    return jsonLiteral(
      icon,
      props.value,
      updateString,
      props.onModeClick,
    );
  default:
    return (
      <>
      <div className="input-group">
        <button type="button"
          className="btn btn-primary p-2"
          onClick={props.onModeClick}>
          {icon}
        </button>
        <input type="text"
          className="form-control"
          defaultValue={props.value} />
      </div>
      <JsonItem value={1} />
      </>
    );
  }
};

export default JsonItemEdit;
