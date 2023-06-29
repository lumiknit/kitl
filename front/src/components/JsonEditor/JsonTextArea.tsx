import { useEffect, createRef } from "react";
import "./JsonEditor.css";

import * as jh from "./helper";

const indentTA = (value: string, start: number, end: number) => {
  // Indent selection and return new value and range
  let s = start;
  while (s > 0 && value[s - 1] !== "\n") {
    s--;
  }
  const lines = value.substring(s, end).split("\n");
  const indentedLines = lines.map((line) => "  " + line);
  const indentedValue = indentedLines.join("\n");
  const newValue = value.substring(0, s) + indentedValue + value.substring(end);
  const newStart = start + 2;
  const newEnd = end + 2 * lines.length;
  return {
    value: newValue,
    start: newStart,
    end: newEnd,
  };
};

const unindentTA = (value: string, start: number, end: number) => {
  // Unindent selection and return new value and start and end
  let s = start;
  while (s > 0 && value[s - 1] !== "\n") {
    s--;
  }
  const lines = value.substring(s, end).split("\n");
  let newStart = start;
  let newEnd = end;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("  ")) {
      if (i === 0) newStart -= 2;
      newEnd -= 2;
      lines[i] = lines[i].substring(2);
    }
  }
  const unindentedValue = lines.join("\n");
  const newValue =
    value.substring(0, s) + unindentedValue + value.substring(end);
  return {
    value: newValue,
    start: newStart,
    end: newEnd,
  };
};

type JsonTextAreaProps = {
  value: jh.Json;
  updateValue: (newValue: jh.Json) => void;
};

const JsonTextArea = (props: JsonTextAreaProps) => {
  const refTA = createRef<HTMLTextAreaElement>();
  const initalValue = JSON.stringify(props.value, null, 2);

  const resizeTextArea = (target: HTMLTextAreaElement) => {
    target.style.height = "0";
    target.style.height = target.scrollHeight + 2 + "px";
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab key
    if (event.key === "Tab") {
      event.preventDefault();
      const target = event.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const value = target.value;
      let indentResult;
      if (event.shiftKey) {
        // Unindent
        indentResult = unindentTA(value, start, end);
      } else {
        // Indent
        indentResult = indentTA(value, start, end);
      }
      target.value = indentResult.value;
      target.selectionStart = indentResult.start;
      target.selectionEnd = indentResult.end;
      resizeTextArea(target);
    } else if (event.key === "Enter") {
      // Enter key
      event.preventDefault();
      const target = event.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const value = target.value;
      // Get previous line indent
      let i = start - 1;
      while (i > 0 && value[i - 1] !== "\n") {
        i--;
      }
      // Find whitespace and copy it
      let j = i;
      while (j < start && (value[j] === " " || value[j] === "\t")) {
        j++;
      }
      const indent = value.substring(i, j);
      const newValue =
        value.substring(0, start) + "\n" + indent + value.substring(end);
      target.value = newValue;
      target.selectionStart = start + 1 + indent.length;
      target.selectionEnd = start + 1 + indent.length;
      resizeTextArea(target);
    }
  };

  const onInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
    // Check if valid JSON
    const target = event.currentTarget;
    const value = target.value;
    try {
      const newValue = JSON.parse(value);
      props.updateValue(newValue);
      target.classList.remove("json-text-area-invalid");
    } catch (e) {
      // Textarea warning
      target.classList.add("json-text-area-invalid");
    }
    // Resize text area
    resizeTextArea(target);
  };

  useEffect(() => {
    if (refTA.current !== null) {
      resizeTextArea(refTA.current);
    }
  });

  return (
    <textarea
      ref={refTA}
      className="json-text-area"
      defaultValue={initalValue}
      onInput={onInput}
      onKeyDown={onKeyDown}
    />
  );
};

export default JsonTextArea;
