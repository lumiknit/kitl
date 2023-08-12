import { useState } from "react";
import * as j from "../../common/json";
import CodeArea from "../CodeArea/CodeArea";

export type NodeEditorLiteralJsonProps = {
  value: j.Json;
  updateValue: (value: j.Json) => void;
};

enum FormatStyle {
  Min = "Min",
  Compact = "Compact",
  Pretty = "Pretty",
}

export type NodeEditorLiteralJsonState = {

  temporaryValue: string;
  /* Error Message */
  message: string;
  hasError: boolean;
};

const NodeEditorLiteralJson = (props: NodeEditorLiteralJsonProps) => {
  const [state, setState] = useState({
  });
  props.value;
  return (
    <div>
      <div className="node-editor-json-format-buttons">
        <div className="input-group">
          <div className="input-group-text">
            Format
          </div>
          <button className="btn btn-outline-secondary flex-grow-1">
            Min
          </button>
          <button className="btn btn-outline-secondary flex-grow-1">
            Compact
            </button>
          <button className="btn btn-outline-secondary flex-grow-1">
            Pretty
            </button>
        </div>
      </div>
      <div
        className="node-editor-json-message">
      </div>
      <CodeArea
        defaultValue={JSON.stringify(props.value)}
      />
    </div>
  );
};

export default NodeEditorLiteralJson;