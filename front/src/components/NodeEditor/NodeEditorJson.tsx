import { useRef, useState } from "react";
import * as j from "../../common/json";
import CodeArea from "../CodeArea/CodeArea";
import JSON5 from "json5";

export type NodeEditorJsonProps = {
  value: j.Json;
  updateValue: (value: j.Json) => void;
};

export type NodeEditorJsonState = {
  temporaryValue: string;
  /* Error Message */
  message: string;
  hasError: boolean;
};

const NodeEditorJson = (props: NodeEditorJsonProps) => {
  const refTA = useRef<HTMLTextAreaElement>(null);

  const [state, setState] = useState<NodeEditorJsonState>({
    temporaryValue: JSON.stringify(props.value),
    message: "",
    hasError: false,
  });

  const format = (formatter: (j: j.Json) => string) => {
    try {
      const j = JSON5.parse(state.temporaryValue);
      props.updateValue(j);
      if (refTA.current !== null) {
        refTA.current.value = formatter(j);
        refTA.current.dispatchEvent(new Event("change"));
      }
      props.updateValue(j);
      setState(oldState => ({
        ...oldState,
        temporaryValue: formatter(j),
        message: "",
        hasError: false,
      }));
    } catch (e) {
      if (e instanceof SyntaxError) {
        const err = e as SyntaxError;
        setState(oldState => ({
          ...oldState,
          message: err.message,
          hasError: true,
        }));
      } else {
        throw e;
      }
    }
  };

  const formatMin = () => format(j.formatJsonMin);
  const formatCompact = () => format(j.formatJsonCompact);
  const formatPretty = () => format(j.formatJsonPretty);

  const onChange = (value: string) => {
    setState(oldState => ({
      ...oldState,
      temporaryValue: value,
      message: "** Modified ** (format to validate and save)",
      hasError: false,
    }));
  };

  return (
    <div>
      Write in JSON5 format.
      <div className="node-editor-json-format-buttons">
        <div className="input-group">
          <div className="input-group-text">Format</div>
          <button
            className="btn btn-outline-secondary flex-grow-1"
            onClick={formatMin}>
            Min
          </button>
          <button
            className="btn btn-outline-secondary flex-grow-1"
            onClick={formatCompact}>
            Compact
          </button>
          <button
            className="btn btn-outline-secondary flex-grow-1"
            onClick={formatPretty}>
            Pretty
          </button>
        </div>
      </div>
      <div
        className={`node-editor-json-message ${
          state.hasError ? "text-danger" : ""
        }`}>
        {state.message}
      </div>
      <CodeArea
        refTA={refTA}
        defaultValue={state.temporaryValue}
        onChange={onChange}
        errorMsg={state.hasError ? state.message : undefined}
      />
    </div>
  );
};

export default NodeEditorJson;
