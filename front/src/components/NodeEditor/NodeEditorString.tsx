import { useRef, useState } from "react";
import * as j from "../../common/json";
import CodeArea from "../Helpers/CodeArea";
import i18n from "../../locales/i18n";

export type NodeEditorStringProps = {
  value: j.Json;
  onChange: (value: j.Json) => void;
};

export type NodeEditorStringState = {
  showEscape: boolean;
  defaultValue: string;
};

const NodeEditorString = (props: NodeEditorStringProps) => {
  const [state, setState] = useState<NodeEditorStringState>(() => ({
    showEscape: true,
    defaultValue:
      typeof props.value === "string"
        ? j.escapeString(props.value)
        : JSON.stringify(props.value),
  }));
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleShowEscapeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const showEscape = e.target.checked;
    if (textareaRef.current !== null) {
      const s = textareaRef.current!.value;
      textareaRef.current!.value = showEscape
        ? j.escapeString(s)
        : j.unescapeString(s);
    }
    setState(oldState => ({
      ...oldState,
      showEscape,
    }));
  };

  const handleChange = (value: string) => {
    if (state.showEscape) {
      value = j.escapeString(value);
    }
    props.onChange(value);
  };

  return (
    <div className="input-group">
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="useNameCheck"
          checked={state.showEscape}
          onChange={handleShowEscapeChange}
        />
        <label className="form-check-label" htmlFor="useNameCheck">
          {i18n.t("nodeEditor.string.showEscape")}
        </label>
      </div>
      <CodeArea
        textareaRef={textareaRef}
        defaultValue={state.defaultValue}
        onChange={handleChange}
      />
    </div>
  );
};

export default NodeEditorString;
