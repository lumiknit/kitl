import React, { ReactElement, useCallback, useState } from "react";

import * as je from "./edit";
import * as jh from "./helper";
import JsonItemValueContainer from "./JsonItemValueContainer";
import JsonItemValueBool from "./JsonItemValueBool";
import JsonItemValueLiteral from "./JsonItemValueLiteral";
import JsonItemAddButton from "./JsonItemAddButton";
import { useJsonEditorContext } from "./JsonEditorProvider";

import JsonItemValueCollection from "./JsonItemValueCollection";
import JsonItemEllipsis from "./JsonItemEllipsis";
import JsonItem from "./JsonItem";

export type JsonItemValueShowProps = {
  path: jh.JsonPath;
  value: jh.Json;
  updateEditing: (f: je.UpdateEdit) => void;
  toggleType: () => void;
  toggleIndex: () => void;
};

export type JsonItemValueShowState = {
  folded: boolean;
};

const displayNumber = (value: jh.Json): string => {
  return String(value);
};

const parseNumber = (value: string): jh.Json => {
  const n = Number(value);
  if (isNaN(n)) {
    return null;
  } else {
    return n;
  }
};

const displayEscapedString = (value: jh.Json): string => {
  return JSON.stringify(value).slice(1, -1);
};

const parseEscapedString = (value: string): jh.Json => {
  try {
    const p = JSON.parse(`"${value}"`);
    if (typeof p === "string") {
      return p;
    }
    return null;
  } catch (e) {
    return null;
  }
};

const displayString = (value: jh.Json): string => {
  return String(value);
};

const parseString = (value: string): jh.Json => {
  return value;
};

const JsonItemValueShow = React.memo((props: JsonItemValueShowProps) => {
  const ctx = useJsonEditorContext();
  const [state, setState] = useState<JsonItemValueShowState>({
    folded: false,
  });
  const ty = jh.jsonTypeOf(props.value);

  const toggleFolded = () => {
    setState({
      folded: !state.folded,
    });
  };

  const addItem = useCallback(() => {
    const newPath = props.path.concat(jh.nextJsonKey(props.value));
    props.updateEditing(je.applyJsonEdit([new je.InsertAction(newPath, null)]));
  }, [props.path, props.updateEditing, props.value]);

  let body = null;
  const children: ReactElement[] = [];
  switch (ty) {
    case jh.JsonType.NULL:
    case jh.JsonType.FALSE:
    case jh.JsonType.TRUE:
      {
        body = (
          <JsonItemValueBool
            indent={props.path.length}
            path={props.path}
            type={ty}
            updateEditing={props.updateEditing}
          />
        );
      }
      break;
    case jh.JsonType.NUMBER:
      {
        body = (
          <JsonItemValueLiteral
            indent={props.path.length}
            path={props.path}
            value={props.value}
            display={displayNumber}
            parse={parseNumber}
            updateEditing={props.updateEditing}
          />
        );
      }
      break;
    case jh.JsonType.STRING:
      {
        let display: (value: jh.Json) => string;
        let parse: (value: string) => jh.Json;
        if (ctx.value.showStringEscape) {
          display = displayEscapedString;
          parse = parseEscapedString;
        } else {
          display = displayString;
          parse = parseString;
        }
        body = (
          <JsonItemValueLiteral
            indent={props.path.length}
            path={props.path}
            value={props.value}
            display={display}
            parse={parse}
            updateEditing={props.updateEditing}
          />
        );
      }
      break;
    case jh.JsonType.ARRAY:
      {
        if (!Array.isArray(props.value)) {
          throw new Error("Invalid array");
        }
        body = (
          <JsonItemValueCollection
            path={props.path}
            type="Array"
            size={props.value.length}
            folded={state.folded}
            toggleFolded={toggleFolded}
          />
        );
        if (!state.folded) {
          for (let i = 0; i < props.value.length; i++) {
            children.push(
              <JsonItem
                key={i}
                path={props.path.concat(i)}
                value={props.value[i]}
                updateEditing={props.updateEditing}
              />
            );
          }
          children.push(
            <JsonItemAddButton
              key={"add"}
              path={props.path}
              onClick={addItem}
            />
          );
        } else {
          children.push(
            <JsonItemEllipsis key={"ellipsis"} path={props.path} />
          );
        }
      }
      break;
    case jh.JsonType.OBJECT:
      {
        const v = props.value;
        if (typeof v !== "object" || v === null || Array.isArray(v)) {
          throw new Error("Invalid object");
        }
        const size = Object.keys(v).length;
        body = (
          <JsonItemValueCollection
            path={props.path}
            type="Object"
            size={size}
            folded={state.folded}
            toggleFolded={toggleFolded}
          />
        );
        if (!state.folded) {
          for (const key in v) {
            const value = v[key];
            children.push(
              <JsonItem
                key={`item-${key}`}
                path={props.path.concat(key)}
                value={value}
                updateEditing={props.updateEditing}
              />
            );
          }
          children.push(
            <JsonItemAddButton
              key={`add`}
              path={props.path}
              onClick={addItem}
            />
          );
        } else {
          children.push(
            <JsonItemEllipsis key={`ellipsis`} path={props.path} />
          );
        }
      }
      break;
  }
  return (
    <>
      <JsonItemValueContainer
        path={props.path}
        value={props.value}
        toggleType={props.toggleType}
        toggleIndex={props.toggleIndex}>
        {body}
      </JsonItemValueContainer>
      {children}
    </>
  );
});

export default JsonItemValueShow;
