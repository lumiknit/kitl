import { ReactElement, createRef, useState } from "react";

import BI from "../Util/BI";
import JsonItem from "./JsonItem";
import JsonItemLine from "./JsonItemLine";
import JsonItemIndex from "./JsonItemIndex";
import JsonItemEditText from "./JsonItemEditText";

import * as jh from "./helper";
import * as jc from "./config";

import "bootstrap/dist/css/bootstrap.css";

import "./JsonEditor.css";
import "./JsonIndent.css";

type JsonItemEditProps = {
  depth: number;
  index: number | string;
  path: string;
  value: jh.Json;
  onModeClick: () => void;
  updateValue: (value: jh.Json, render?: boolean) => void;
  config: jc.Config;
};

const jsonConst = (
  icon: ReactElement,
  label: string,
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
    <span className="input-group-text py-1">{label}</span>
  </div>
);

const jsonLiteral = (
  icon: ReactElement,
  depth: number,
  value: string,
  updateValue: (value: string) => boolean,
  onModeClick: () => void
) => {
  return (
    <div className="input-group">
      <button
        type="button"
        className={`btn ${jh.jsonBtnColorClass(depth)} py-1`}
        onClick={onModeClick}
      >
        {icon}
      </button>
      <JsonItemEditText value={value} updateValue={updateValue} />
    </div>
  );
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
      lineItem = jsonConst(
        icon,
        String(props.value),
        props.depth,
        props.onModeClick
      );
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
        lineItem = jsonLiteral(
          icon,
          props.depth,
          String(props.value),
          updateNumber,
          props.onModeClick
        );
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
        lineItem = jsonLiteral(
          icon,
          props.depth,
          value,
          update,
          props.onModeClick
        );
      }
      break;
    case jh.JsonType.ARRAY:
      {
        if (!Array.isArray(props.value) || props.value === null) {
          throw "Expect array, but got " + typeof props.value;
        }
        const jsonBtnColorClass = jh.jsonBtnColorClass(props.depth);
        const jsonBtnColorClassNext = jh.jsonBtnColorClass(props.depth + 1);
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
              ref={indexRef}
              type="text"
              className="form-control py-1"
              placeholder="new index"
            />
            <button
              type="button"
              className={`btn ${jsonBtnColorClassNext} py-1`}
              onClick={onClickAdd}
            >
              <BI iconName="plus-square" />
            </button>
          </div>
        );
        for (let i = 0; i < props.value.length; i++) {
          lineNext.push(
            <JsonItem
              key={`${state.cnt} ${i}`}
              index={i}
              path={i + " < " + props.path}
              value={props.value[i]}
              updateValue={updateElement(i)}
              depth={props.depth + 1}
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
        const jsonBtnColorClass = jh.jsonBtnColorClass(props.depth);
        const jsonBtnColorClassNext = jh.jsonBtnColorClass(props.depth + 1);
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
              ref={indexRef}
              type="text"
              className="form-control py-1"
              placeholder="new key"
            />
            <button
              type="button"
              className={`btn ${jsonBtnColorClassNext} py-1`}
              onClick={onClickAdd}
            >
              <BI iconName="plus-square" />
            </button>
          </div>
        );
        for (const key in props.value) {
          lineNext.push(
            <JsonItem
              key={`${state.cnt}\u0001${key}`}
              index={key}
              path={key + " < " + props.path}
              value={props.value[key]}
              updateValue={updateElement(key)}
              depth={props.depth + 1}
              config={props.config}
            />
          );
        }
      }
      break;
  }
  return (
    <>
      <JsonItemLine depth={props.depth}>
        <div className="json-item-line-content">
          <JsonItemIndex
            index={props.index}
            path={props.path}
            updateIndex={() => {
              throw "Not implemented";
            }}
          />
          {lineItem}
        </div>
      </JsonItemLine>
      {lineNext}
    </>
  );
};

export default JsonItemEdit;
