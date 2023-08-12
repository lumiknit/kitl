import { useState } from "react";
import * as j from "../../common/json";
import CodeArea from "../CodeArea/CodeArea";

export type NodeEditorJsonProps = {
  value: j.Json;
  updateValue: (value: j.Json) => void;
};

enum FormatStyle {
  Unformatted = "Unformatted",
  Min = "Min",
  Compact = "Compact",
  Pretty = "Pretty",
}

export type NodeEditorLiteralJsonState = {
  formatStyle: FormatStyle;
  temporaryValue: string;
  /* Error Message */
  message: string;
  hasError: boolean;
};

const NodeEditorJson = (props: NodeEditorJsonProps) => {
  const [state, setState] = useState({
    formatStyle: FormatStyle.Unformatted,
    temporaryValue: JSON.stringify(props.value),
  });
  props.value;
  return (
    <div>
      <div className="node-editor-json-format-buttons">
        <div className="input-group">
          <div className="input-group-text">Format</div>
          <button className="btn btn-outline-secondary flex-grow-1">Min</button>
          <button className="btn btn-outline-secondary flex-grow-1">
            Compact
          </button>
          <button className="btn btn-outline-secondary flex-grow-1">
            Pretty
          </button>
        </div>
      </div>
      <div className="node-editor-json-message"></div>
      <CodeArea defaultValue={state.temporaryValue} />
    </div>
  );
};

export default NodeEditorJson;
