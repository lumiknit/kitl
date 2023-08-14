import { ChangeEvent, useState } from "react";
import * as j from "../../common/json";
import RadioButtons from "../Helpers/RadioButtons";

export type NodeEditorNumberProps = {
  value: j.Json;
  onChange: (value: j.Json) => void;
};

export type NodeEditorNumberState = {
  base: number;
  value: number;
  hasError: boolean;
};

const baseToIndex = new Map<number, number>([
  [2, 0],
  [8, 1],
  [10, 2],
  [16, 3],
]);

const baseNames = ["Bin", "Oct", "Dec", "Hex"];

const baseToPrefix = new Map<number, string>([
  [2, "0b"],
  [8, "0o"],
  [10, ""],
  [16, "0x"],
]);

const nameToBase = new Map<string, number>([
  ["0b", 2],
  ["0o", 8],
  ["", 10],
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

  const handleBaseChange = (newBase: string) => {
    let newContent = state.content;
    let hasError = false;
    const base = nameToBase.get(newBase) || 10;
    const newNum = parseFloat(state.content, state.base);
    if (!isNaN(newNum)) {
      newContent = newNum.toString(base);
      hasError = false;
    } else {
      hasError = true;
    }
    setState(oldState => {
      return {
        ...oldState,
        base: base,
        content: newContent,
        hasError: hasError,
      };
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    const newNum = parseFloat(newVal, state.base);
    if (!isNaN(newNum)) {
      props.onChange(newNum);
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

  let radioIndex = baseToIndex.get(state.base);
  if (radioIndex === undefined) {
    radioIndex = 2;
  }

  const inputType = state.base <= 10 ? "number" : "text";
  const pattern = state.base <= 10 ? "[-+0-9.]*" : "[-+0-9a-fA-F.]*";

  return (
    <div>
      <div className="input-group">
        <RadioButtons
          selected={radioIndex}
          onClick={idx => {
            const newBase = [2, 8, 10, 16][idx];
            handleBaseChange(baseToPrefix.get(newBase) || "");
          }}
          className="flex-grow-1">
          {[2, 8, 10, 16].map((_base, idx) => (
            <span key={idx}>{baseNames[idx]}</span>
          ))}
        </RadioButtons>
      </div>
      <div className="input-group">
        <div className="input-group-text">{baseToPrefix.get(state.base)}</div>
        <input
          className={`form-control ${state.hasError ? "is-invalid" : ""}`}
          type={inputType}
          value={state.content}
          onChange={handleInputChange}
          pattern={pattern}
        />
      </div>
    </div>
  );
};

export default NodeEditorNumber;
