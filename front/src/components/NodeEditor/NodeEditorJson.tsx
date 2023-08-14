import { ReactElement, useRef, useState } from "react";
import * as j from "../../common/json";
import CodeArea from "../Helpers/CodeArea";
import JSON5 from "json5";

export type NodeEditorJsonProps = {
  value: j.Json;
  onChange: (value: j.Json) => void;
};

export type NodeEditorJsonState = {
  temporaryValue: string;
  /* Error Message */
  message?: ReactElement;
  hasError: boolean;
};

const Message = (props: {
  color: string;
  badge: string;
  children?: string | ReactElement | ReactElement[];
}) => {
  return (
    <span>
      <span className={`badge bg-${props.color}`}>{props.badge}</span>
      &nbsp;
      {props.children}
    </span>
  );
};

const NodeEditorJson = (props: NodeEditorJsonProps) => {
  const refTA = useRef<HTMLTextAreaElement>(null);

  const [state, setState] = useState<NodeEditorJsonState>(() => ({
    temporaryValue: JSON.stringify(props.value),
    hasError: false,
  }));

  const format = (formatter: (j: j.Json) => string) => {
    try {
      const j = JSON5.parse(state.temporaryValue);
      props.onChange(j);
      if (refTA.current !== null) {
        refTA.current.value = formatter(j);
        refTA.current.dispatchEvent(new Event("change"));
      }
      props.onChange(j);
      setState(oldState => ({
        ...oldState,
        temporaryValue: formatter(j),
        message: undefined,
        hasError: false,
      }));
    } catch (e) {
      if (e instanceof SyntaxError) {
        const err = e as SyntaxError;
        setState(oldState => ({
          ...oldState,
          message: (
            <Message color="danger" badge="ERROR">
              {err.message}
            </Message>
          ),
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

  const handleCodeAreaChange = (value: string) => {
    setState(oldState => ({
      ...oldState,
      temporaryValue: value,
      message: (
        <Message color="warning" badge="WARNING">
          Format to apply.
        </Message>
      ),
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
      <div className="node-editor-json-message my-1">{state.message}</div>
      <CodeArea
        textareaRef={refTA}
        defaultValue={state.temporaryValue}
        onChange={handleCodeAreaChange}
        errorMessage={state.hasError ? "JSON Syntax Error" : undefined}
      />
    </div>
  );
};

export default NodeEditorJson;
