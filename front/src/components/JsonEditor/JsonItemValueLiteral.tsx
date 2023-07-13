import { useState, createRef, useEffect } from "react";

import * as jh from "./helper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

export type JsonItemValueLiteralProps = {
  indent: number;
  value: jh.Json;
  display: (value: jh.Json) => string;
  parse: (value: string) => jh.Json;
  updateValue: (value: jh.Json) => void;
};

const JsonItemValueLiteral = (props: JsonItemValueLiteralProps) => {
  const [state, setState] = useState({
    editing: false,
  });

  const btnClass = `btn json-btn-depth-${props.indent % 6}`;

  const refTA = createRef<HTMLTextAreaElement>();

  const resizeTextArea = (target: HTMLTextAreaElement) => {
    target.style.height = "0";
    target.style.height = target.scrollHeight + 2 + "px";
  };

  useEffect(() => {
    const target = refTA.current;
    if (target !== null) {
      resizeTextArea(target);
    }
  });

  if (state.editing) {
    const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Tab key
      if (event.key === "Tab") {
        event.preventDefault();
        const target = event.currentTarget;
        const start = target.selectionStart;
        const end = target.selectionEnd;
        const value = target.value;
        target.value = value.substring(0, start) + "\t" + value.substring(end);
        resizeTextArea(target);
      }
    };

    const onInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
      // Resize text area
      const target = event.currentTarget;
      resizeTextArea(target);
    };

    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      // Update value
      const target = event.currentTarget;
      const value = props.parse(target.value);
      if (value !== null) {
        props.updateValue(value);
      }
    };

    const apply = () => {
      const target = refTA.current;
      if (target === null) {
        return;
      }
      const value = props.parse(target.value);
      if (value !== null) {
        props.updateValue(value);
      }
      setState({ editing: false });
    };

    return (
      <>
        <textarea
          ref={refTA}
          className="form-control json-item-value-literal py-1 px-2"
          defaultValue={props.display(props.value)}
          onKeyDown={onKeyDown}
          onInput={onInput}
          onChange={onChange}
          onBlur={apply}
          autoFocus
        />
        <button
          className={`${btnClass} py-1 px-2`}
          type="button"
          onClick={apply}>
          <FontAwesomeIcon icon={faCheck} />
        </button>
      </>
    );
  } else {
    return (
      <>
        <div
          className={`form-control json-item-value-literal-view py-1 px-2  flex-grow-1`}
          onClick={() => setState({ editing: true })}>
          {props.display(props.value)}
        </div>
      </>
    );
  }
};

export default JsonItemValueLiteral;
