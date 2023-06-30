import { ReactElement, createRef, useState } from "react";

import BI from "../Util/BI";
import JsonItem from "./JsonItem";
import JsonItemLine from "./JsonItemLine";
import JsonItemEditText from "./JsonItemEditText";

import * as jh from "./helper";
import * as jc from "./JsonEditorContext";

import "bootstrap/dist/css/bootstrap.css";

import "./JsonEditor.css";
import "./JsonIndent.css";

type JsonItemEditProps = {
  position: jh.Position;
  value: jh.Json;
  onModeClick: () => void;
  updateValue: (value: jh.Json, render?: boolean) => void;
  config: jc.Config;
};

const jsonConst = (label: string) => [
  <span key="0" className="input-group-text py-1 flex-grow-1">
    {label}
  </span>,
];

const jsonLiteral = (
  value: string,
  updateValue: (value: string) => boolean
) => [<JsonItemEditText key="0" value={value} updateValue={updateValue} />];

const updateNumber =
  (updateValue: (value: jh.Json) => void) => 
  (value: string) => {
    const newValue = Number(value);
    if (isNaN(newValue)) {
      return false;
    }
    updateValue(newValue);
    return true;
};

const updateEscapedString =
  (updateValue: (value: jh.Json) => void) =>
  (value: string) => {
    try {
      updateValue(jh.unescapeString(value));
      return true;
    } catch(e) {
      return false;
    }
  };

const updateElement =
  (container: jh.Json, key: jh.JsonKey) =>
  (value: jh.Json) => {
    if (Array.isArray(container)) {
      if (typeof key === "number") {
        container[key] = value;
        return;
      }
    } else if (
      container !== null &&
      typeof container === "object" &&
      typeof key === "string"
    ) {
      container[key] = value;
      return;
    }
    throw "Invalid container type or key";
  };

const JsonItemEdit = (props: JsonItemEditProps) => {
  const [state, setState] = useState({
    cnt: 0,
  });

  const rerender = () => {
    setState({
      cnt: state.cnt + 1,
    });
  };

  const jsonType = jh.jsonTypeOf(props.value);
  const icon = <BI iconName={jh.jsonTypeIcons[jsonType]} />;

  let lineItems: ReactElement[] = [];
  const lineNext: ReactElement[] = [];

  switch (jsonType) {
    case jh.JsonType.NULL:
    case jh.JsonType.FALSE:
    case jh.JsonType.TRUE:
      lineItems = jsonConst(String(props.value));
      break;
    case jh.JsonType.NUMBER:
      if (typeof props.value !== "number") {
        throw "Expect number, but got " + typeof props.value;
      }
      lineItems = jsonLiteral(
        String(props.value),
        updateNumber(props.updateValue),
      );
      break;
    case jh.JsonType.STRING:
      if (typeof props.value !== "string") {
        throw "Expect string, but got " + typeof props.value;
      }
      if(props.config.showStringEscape) {
        lineItems = jsonLiteral(
          jh.escapeString(props.value),
          updateEscapedString(props.updateValue),
        );
      } else {
        lineItems = jsonLiteral(
          props.value,
          (value: string) => {
            props.updateValue(value);
            return true;
          },
        );
      }
      break;
    case jh.JsonType.ARRAY:
      {
        if (!Array.isArray(props.value) || props.value === null) {
          throw "Expect array, but got " + typeof props.value;
        }
        const jsonBtnColorClassNext = jh.jsonBtnColorClass(
          props.position.depth + 1
        );
        const indexRef = createRef<HTMLInputElement>();
        const onClickAdd = () => {
          if (!Array.isArray(props.value)) {
            throw "Expect array, but got " + typeof props.value;
          }
          if (indexRef.current === null) {
            return;
          }
          let key = indexRef.current.value;
          if (key === "") {
            key = "@";
          }
          const index = Number(key);
          if (isNaN(index)) {
            props.value.push(null);
          } else {
            props.value.splice(index, 0, null);
          }
          props.updateValue(props.value, true);
          indexRef.current.value = "";
          rerender();
        };
        lineItems = [
          <input
            key="0"
            ref={indexRef}
            type="text"
            className="form-control py-1"
            placeholder="new index"
          />,
          <button
            key="1"
            type="button"
            className={`btn ${jsonBtnColorClassNext} py-1`}
            onClick={onClickAdd}>
            <BI iconName="plus-square" />
          </button>,
        ];
        for (let i = 0; i < props.value.length; i++) {
          lineNext.push(
            <JsonItem
              key={`${state.cnt} ${i}`}
              position={props.position.child(i)}
              value={props.value[i]}
              updateValue={updateElement(props.value, i)}
              config={props.config}
            />
          );
        }
      }
      break;
    case jh.JsonType.OBJECT:
      {
        if (
          typeof props.value !== "object" ||
          props.value === null ||
          Array.isArray(props.value)
        ) {
          throw "Expect object, but got " + typeof props.value;
        }
        const jsonBtnColorClassNext = jh.jsonBtnColorClass(
          props.position.depth + 1
        );
        const indexRef = createRef<HTMLInputElement>();
        const onClickAdd = () => {
          if (
            props.value === null ||
            typeof props.value !== "object" ||
            Array.isArray(props.value)
          ) {
            throw "Expect object, but got " + typeof props.value;
          }
          if (indexRef.current === null) {
            return;
          }
          const key = indexRef.current.value;
          props.value[key] = null;
          props.updateValue(props.value, true);
          indexRef.current.value = "";
          rerender();
        };
        lineItems = [
          <input
            key="0"
            ref={indexRef}
            type="text"
            className="form-control py-1"
            placeholder="new key"
          />,
          <button
            key="1"
            type="button"
            className={`btn ${jsonBtnColorClassNext} py-1`}
            onClick={onClickAdd}>
            <BI iconName="plus-square" />
          </button>,
        ];
        for (const key in props.value) {
          lineNext.push(
            <JsonItem
              key={`${state.cnt}\u0001${key}`}
              position={props.position.child(key)}
              value={props.value[key]}
              updateValue={updateElement(props.value, key)}
              config={props.config}
            />
          );
        }
      }
      break;
    default:
      throw "Unknown json type: " + jsonType;
  }
  return (
    <>
      <JsonItemLine position={props.position}>
        <div className="input-group">
          {/* Handle */}
          <button type="button" className="btn btn-outline-secondary p-1">
            <BI iconName="dash" />
          </button>
          {/* Type button */}
          <button
            type="button"
            className={`btn ${jh.jsonBtnColorClass(props.position.depth)} py-1`}
            onClick={props.onModeClick}>
            {icon}
          </button>
          {/* Main items */}
          {lineItems}
        </div>
      </JsonItemLine>
      {lineNext}
    </>
  );
};

export default JsonItemEdit;
