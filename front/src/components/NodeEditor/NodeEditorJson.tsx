import { ReactElement, useRef, useState } from "react";
import JSON5 from "json5";
import toast from "react-hot-toast";

import i18n from "../../locales/i18n";

import * as j from "../../common/json";
import CodeArea from "../Helpers/CodeArea";


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
            <Message color="danger" badge={i18n.t('ERROR')}>
              {err.message}
            </Message>
          ),
          hasError: true,
        }));
        toast.error(i18n.t("nodeEditor.json.syntaxError"));
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
        <Message color="warning" badge={i18n.t("modified")}>
          {i18n.t("nodeEditor.json.formatToApply")}
        </Message>
      ),
      hasError: false,
    }));
  };

  return (
    <div>
      {i18n.t("nodeEditor.json.formatDescription")}
      <div className="node-editor-json-format-buttons">
        <div className="input-group">
          <div className="input-group-text">{i18n.t("nodeEditor.json.format")}</div>
          <button
            className="btn btn-outline-secondary flex-grow-1"
            onClick={formatMin}>
            {i18n.t("nodeEditor.json.btnMin")}
          </button>
          <button
            className="btn btn-outline-secondary flex-grow-1"
            onClick={formatCompact}>
            {i18n.t("nodeEditor.json.btnCompact")}
          </button>
          <button
            className="btn btn-outline-secondary flex-grow-1"
            onClick={formatPretty}>
            {i18n.t("nodeEditor.json.btnPretty")}
          </button>
        </div>
      </div>
      <div className="node-editor-json-message my-1">{state.message}</div>
      <CodeArea
        textareaRef={refTA}
        defaultValue={state.temporaryValue}
        onChange={handleCodeAreaChange}
        errorMessage={state.hasError ? i18n.t("nodeEditor.json.syntaxError") : undefined}
      />
    </div>
  );
};

export default NodeEditorJson;
