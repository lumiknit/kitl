import { ReactElement, useEffect, useRef, useState } from "react";
import YAML from "yaml";
import toast from "react-hot-toast";

import i18n from "../../locales/i18n";

import * as j from "../../common/json";
import CodeArea from "../Helpers/CodeArea";
import RadioButtons from "../Helpers/RadioButtons";

export enum FormatStyle {
  Min = 0,
  Pretty = 1,
  Yaml = 2,
}

const parseFormatted = (format: FormatStyle, value: string): j.Json => {
  switch (format) {
    case FormatStyle.Min:
    case FormatStyle.Pretty:
      return JSON.parse(value);
    case FormatStyle.Yaml:
      return YAML.parse(value);
  }
};

const formatObject = (format: FormatStyle, value: j.Json) => {
  switch (format) {
    case FormatStyle.Min:
      return JSON.stringify(value);
    case FormatStyle.Pretty:
      return JSON.stringify(value, null, 2);
    case FormatStyle.Yaml:
      return YAML.stringify(value);
  }
};

export type NodeEditorJsonProps = {
  value: j.Json;
  onChange: (value: j.Json) => void;
};

export type NodeEditorJsonState = {
  taContent: string;
  formatStyle: FormatStyle;
  /* Error Message */
  message?: ReactElement;
  hasError: boolean;
  formatTimeout?: number;
  shouldReformat: boolean;
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
    taContent: formatObject(FormatStyle.Pretty, props.value),
    formatStyle: FormatStyle.Pretty,
    hasError: false,
    shouldReformat: false,
  }));

  const parse = () => {
    const content = state.taContent;
    // Try to parse
    try {
      return parseFormatted(state.formatStyle, content);
    } catch (e) {
      toast.error(i18n.t("nodeEditor.json.syntaxError"));
      setState(oldState => ({
        ...oldState,
        message: (
          <Message color="danger" badge={i18n.t("ERROR")}>
            {String(e)}
          </Message>
        ),
        hasError: true,
      }));
    }
  };

  const handleFormatClick = (index: number) => {
    const fs = index as FormatStyle;
    // Read content
    const parsed = parse();
    if (parsed === undefined) {
      return;
    }
    // Reformat
    const formatted = formatObject(fs, parsed);
    if (refTA.current !== null) {
      refTA.current.value = formatted;
    }
    setState(oldState => ({
      ...oldState,
      formatStyle: fs,
      taContent: formatted,
    }));
  };

  const handleCodeAreaChange = (value: string) => {
    // Clear timeout
    let timeout = state.formatTimeout;
    if (timeout === undefined) {
      timeout = setTimeout(() => {
        setState(oldState => ({
          ...oldState,
          formatTimeout: undefined,
          shouldReformat: true,
        }));
      }, 1000);
    }
    // New timeout to format
    setState(oldState => ({
      ...oldState,
      taContent: value,
      message: (
        <Message color="warning" badge={i18n.t("modified")}>
          {i18n.t("nodeEditor.json.formatToSave")}
        </Message>
      ),
      hasError: false,
      formatTimeout: timeout,
    }));
  };

  useEffect(() => {
    if (state.shouldReformat) {
      try {
        const j = parseFormatted(state.formatStyle, state.taContent);
        props.onChange(j);
        setState(oldState => ({
          ...oldState,
          message: (
            <Message color="success" badge={i18n.t("SUCCESS")}>
              {i18n.t("nodeEditor.json.valid")}
            </Message>
          ),
          hasError: false,
          shouldReformat: false,
        }));
      } catch (e) {
        toast.error(i18n.t("nodeEditor.json.syntaxError"));
        setState(oldState => ({
          ...oldState,
          message: (
            <Message color="danger" badge={i18n.t("ERROR")}>
              {String(e)}
            </Message>
          ),
          hasError: true,
          shouldReformat: false,
        }));
      }
    }
  });

  return (
    <div>
      <div className="node-editor-json-format-buttons">
        <div className="input-group">
          <div className="input-group-text">
            {i18n.t("nodeEditor.json.format")}
          </div>
          <RadioButtons
            className="flex-grow-1"
            selected={state.formatStyle}
            onClick={handleFormatClick}>
            <span> {i18n.t("nodeEditor.json.btnMin")} </span>
            <span> {i18n.t("nodeEditor.json.btnPretty")} </span>
            <span> YAML </span>
          </RadioButtons>
        </div>
      </div>
      <div className="node-editor-json-message my-1">{state.message}</div>
      <CodeArea
        textareaRef={refTA}
        defaultValue={state.taContent}
        onChange={handleCodeAreaChange}
        errorMessage={
          state.hasError ? i18n.t("nodeEditor.json.syntaxError") : undefined
        }
      />
    </div>
  );
};

export default NodeEditorJson;
