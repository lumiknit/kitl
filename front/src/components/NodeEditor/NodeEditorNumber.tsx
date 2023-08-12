import { ChangeEvent, useState } from "react";
import * as j from "../../common/json";
import DropdownSelect from "../Helpers/DropdownSelect";

export type NodeEditorNumberProps = {
  value: j.Json;
  updateValue: (value: j.Json) => void;
};

export type NodeEditorNumberState = {
  base: number;
  value: number;
  hasError: boolean;
};

const baseToName = new Map<number, string>([
  [2, "0b"],
  [8, "0o"],
  [10, "(10)"],
  [16, "0x"],
]);

const nameToBase = new Map<string, number>([
  ["0b", 2],
  ["0o", 8],
  ["(10)", 10],
  ["0x", 16],
]);

const parseFloat = (s: string, base: number): number => {
  const tr = s.trim();
  if (tr.length === 0) {
    return NaN;
  }
  let p = 0;
  let sign = 1;
  if (tr[p] === "-") {
    sign = -1;
    p++;
  } else if (tr[p] === "+") {
    p++;
  }
  let num = 0;
  while (p < tr.length) {
    if (tr[p] === ".") {
      break;
    }
    const digit = parseInt(tr[p], base);
    if (isNaN(digit)) {
      return NaN;
    }
    num = num * base + digit;
    p++;
  }
  if (tr[p] === ".") {
    p++;
    let frac = 0;
    let fracBase = 1;
    while (p < tr.length) {
      const digit = parseInt(tr[p], base);
      if (isNaN(digit)) {
        return NaN;
      }
      frac = frac * base + digit;
      fracBase *= base;
      p++;
    }
    num += frac / fracBase;
  }
  return num * sign;
};

const NodeEditorNumber = (props: NodeEditorNumberProps) => {
  const [state, setState] = useState(() => ({
    base: 10,
    content: typeof props.value === "number" ? props.value.toString(10) : "",
    hasError: false,
  }));

  const onBaseChange = (newBase: string) => {
    let newContent = state.content;
    let hasError = false;
    const base = nameToBase.get(newBase) || 10;
    const newNum = parseFloat(state.content, state.base);
    console.log(base, state.content, newNum);
    if (!isNaN(newNum)) {
      newContent = newNum.toString(base);
      hasError = false;
    } else {
      hasError = true;
    }
    console.log(newContent, hasError);
    setState(oldState => {
      return {
        ...oldState,
        base: base,
        content: newContent,
        hasError: hasError,
      };
    });
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    const newNum = parseFloat(newVal, state.base);
    if (!isNaN(newNum)) {
      props.updateValue(newNum);
      setState(oldState => {
        return {
          ...oldState,
          content: e.target.value,
          hasError: false,
        };
      });
    } else {
      setState(oldState => {
        return {
          ...oldState,
          content: e.target.value,
          hasError: true,
        };
      });
    }
  };

  return (
    <div className="input-group">
      <DropdownSelect
        options={["0b", "0o", "(10)", "0x"]}
        value={baseToName.get(state.base) || "Unk"}
        onChange={onBaseChange}
        btnClassName="btn btn-secondary"
      />
      <input
        className={`form-control ${state.hasError ? "is-invalid" : ""}`}
        type="text"
        value={state.content}
        onChange={onChange}
      />
    </div>
  );
};

export default NodeEditorNumber;
