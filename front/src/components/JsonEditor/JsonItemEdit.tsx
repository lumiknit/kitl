import { ReactElement } from "react";

import * as jh from "./helper";
import BI from "../Util/BI";
import JsonItem from "./JsonItem";
import JsonItemIndent from "./JsonItemIndent";
import JsonItemIndex from "./JsonItemIndex";

import "bootstrap/dist/css/bootstrap.css";

import "./JsonEditor.css";
import "./JsonIndent.css";

type JsonItemEditProps = {
  depth: number;
  index: number | string;
  value: jh.Json;
  onModeClick: () => void;
  updateValue: (value: jh.Json, render?: boolean) => void;
};

const jsonConst = (
  icon: ReactElement,
  depth: number,
  onModeClick: () => void
) => (
  <div className="input-group">
    <button
      type="button"
      className={`btn ${jh.jsonBtnColorClass(depth)} py-1`}
      onClick={onModeClick}
    >
      {icon}
    </button>
  </div>
);

const jsonLiteral = (
  icon: ReactElement,
  depth: number,
  value: string,
  parse: (value: string) => void,
  onModeClick: () => void
) => {
  const onInput = (event: React.FormEvent<HTMLInputElement>) => {
    const newValue = parse(event.currentTarget.value);
    console.log(newValue);
  };
  return (
    <div className="input-group">
      <button
        type="button"
        className={`btn ${jh.jsonBtnColorClass(depth)} py-1`}
        onClick={onModeClick}
      >
        {icon}
      </button>
      <input
        type="text"
        className="form-control py-1"
        onInput={onInput}
        defaultValue={value}
      />
    </div>
  );
};

const JsonItemEdit = (props: JsonItemEditProps) => {
  const jsonType = jh.jsonTypeOf(props.value);
  const icon = <BI iconName={jh.jsonTypeIcons[jsonType]} />;

  const updateNumber = (value: string) => {
    const newValue = Number(value);
    if (isNaN(newValue)) {
      return;
    }
    props.updateValue(newValue);
  };

  const updateString = (value: string) => {
    props.updateValue(value);
  };

  const updateElement = (key: jh.JsonKey) => {
    return (value: jh.Json) => {
      if (Array.isArray(props.value)) {
        if (typeof key === "number") {
          props.value[key] = value;
        }
      } else if (
        props.value !== null &&
        typeof props.value === "object" &&
        typeof key === "string"
      ) {
        props.value[key] = value;
      }
    };
  };

  let lineItem;
  const lineNext: ReactElement[] = [];

  switch (jsonType) {
    case jh.JsonType.NULL:
    case jh.JsonType.FALSE:
    case jh.JsonType.TRUE:
      lineItem = jsonConst(icon, props.depth, props.onModeClick);
      break;
    case jh.JsonType.NUMBER:
      lineItem = jsonLiteral(
        icon,
        props.depth,
        String(props.value),
        updateNumber,
        props.onModeClick
      );
      break;
    case jh.JsonType.STRING:
      lineItem = jsonLiteral(
        icon,
        props.depth,
        String(props.value),
        updateString,
        props.onModeClick
      );
      break;
    case jh.JsonType.ARRAY:
      {
        if (!Array.isArray(props.value) || props.value === null) {
          break;
        }
        const jsonBtnColorClass = jh.jsonBtnColorClass(props.depth);
        const jsonBtnColorClassNext = jh.jsonBtnColorClass(props.depth + 1);
        lineItem = (
          <div className="input-group">
            <button
              type="button"
              className={`btn ${jsonBtnColorClass} py-1`}
              onClick={props.onModeClick}
            >
              {icon}
            </button>
            <input
              type="text"
              className="form-control py-1"
              placeholder="new key"
            />
            <button
              type="button"
              className={`btn ${jsonBtnColorClassNext} py-1`}
              onClick={() => {
                props.value.push(null);
                props.updateValue(props.value, true);
              }}
            >
              <BI iconName="plus-square" />
            </button>
          </div>
        );
        for (let i = 0; i < props.value.length; i++) {
          lineNext.push(
            <JsonItem
              index={i}
              value={props.value[i]}
              updateValue={updateElement(i)}
              depth={props.depth + 1}
            />
          );
        }
      }
      break;
    default:
      lineItem = <div className="input-group">Unimplemented</div>;
  }
  return (
    <>
      <div className="json-item-line">
        <JsonItemIndent level={props.depth} />
        <div className="json-item-line-content">
          <JsonItemIndex index={props.index} />
          {lineItem}
        </div>
      </div>
      {lineNext}
    </>
  );
};

export default JsonItemEdit;
