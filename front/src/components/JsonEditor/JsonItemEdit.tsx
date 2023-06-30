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

  let lineItems: ReactElement[] = [];
  const lineNext: ReactElement[] = [];

  switch (jsonType) {
    case jh.JsonType.NULL:
    case jh.JsonType.FALSE:
    case jh.JsonType.TRUE:
      lineItems = jsonConst(String(props.value));
      break;
    case jh.JsonType.NUMBER:
      {
        const updateNumber = (value: string) => {
          const newValue = Number(value);
          if (isNaN(newValue)) {
            return false;
          }
          props.updateValue(newValue);
          return true;
        };
        lineItems = jsonLiteral(String(props.value), updateNumber);
      }
      break;
    case jh.JsonType.STRING:
      {
        if (typeof props.value !== "string") {
          break;
        }
        let value;
        let update;
        if (props.config.showStringEscape) {
          value = jh.escapeString(props.value);
          update = (value: string) => {
            try {
              props.updateValue(jh.unescapeString(value));
              return true;
            } catch (e) {
              return false;
            }
          };
        } else {
          value = props.value;
          update = (value: string) => {
            props.updateValue(value);
            return true;
          };
        }
        lineItems = jsonLiteral(value, update);
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
              updateValue={updateElement(i)}
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
              updateValue={updateElement(key)}
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
          <button type="button" className="btn btn-outline-secondary p-1">
            <BI iconName="dash" />
          </button>
          <button
            type="button"
            className={`btn ${jh.jsonBtnColorClass(props.position.depth)} py-1`}
            onClick={props.onModeClick}>
            {icon}
          </button>
          {lineItems}
        </div>
      </JsonItemLine>
      {lineNext}
    </>
  );
};

export default JsonItemEdit;
