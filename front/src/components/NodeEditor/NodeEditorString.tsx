import { useRef, useState } from "react";
import * as j from "../../common/json";
import CodeArea from "../CodeArea/CodeArea";

export type NodeEditorStringProps = {
  value: j.Json;
  updateValue: (value: j.Json) => void;
};

export type NodeEditorStringState = {
  showEscape: boolean;
  defaultValue: string;
};

const escape = (s: string): string => {
  let j = JSON.stringify(s);
  j = j.substring(1, j.length - 1);
  j = j.replace(/\\"/g, '"');
  return j;
};

const unescape = (s: string): string => {
  // Count last backslash
  let i = s.length - 1;
  let backslashCount = 0;
  while (i >= 0 && s[i] === "\\") {
    backslashCount++;
    i--;
  }
  if (backslashCount % 2 === 1) {
    s = s + "\\";
  }
  s = s.replace(/"/g, '\\"');
  s = s.replace(/\n/g, "\\n");
  return JSON.parse(`"${s}"`);
};

const NodeEditorString = (props: NodeEditorStringProps) => {
  const [state, setState] = useState<NodeEditorStringState>(() => ({
    showEscape: true,
    defaultValue:
      typeof props.value === "string"
        ? escape(props.value)
        : JSON.stringify(props.value),
  }));
  const refTA = useRef<HTMLTextAreaElement>(null);

  const onShowEscapeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const showEscape = e.target.checked;
    if (refTA.current !== null) {
      const s = refTA.current!.value;
      refTA.current!.value = showEscape ? escape(s) : unescape(s);
    }
    setState(oldState => ({
      ...oldState,
      showEscape,
    }));
  };

  const onChange = (value: string) => {
    if (state.showEscape) {
      value = unescape(value);
    }
    props.updateValue(value);
  };

  return (
    <div className="input-group">
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="useNameCheck"
          checked={state.showEscape}
          onChange={onShowEscapeChange}
        />
        <label className="form-check-label" htmlFor="useNameCheck">
          Show escape chars
        </label>
      </div>
      <CodeArea
        refTA={refTA}
        defaultValue={state.defaultValue}
        onChange={onChange}
      />
    </div>
  );
};

export default NodeEditorString;
