import { useEffect, createRef } from "react";
import "./CodeArea.css";

const indentTA = (value: string, start: number, end: number) => {
  // Indent selection and return new value and range
  let s = start;
  while (s > 0 && value[s - 1] !== "\n") {
    s--;
  }
  const lines = value.substring(s, end).split("\n");
  const indentedLines = lines.map(line => "  " + line);
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

export type CodeAreaProps = {
  valueBox: string[];
};

const CodeArea = (props: CodeAreaProps) => {
  const refTA = createRef<HTMLTextAreaElement>();

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
    // Resize text area
    const target = event.currentTarget;
    resizeTextArea(target);
  };

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Update value
    props.valueBox[0] = event.currentTarget.value;
  };

  useEffect(() => {
    if (refTA.current !== null) {
      resizeTextArea(refTA.current);
    }
  });

  return (
    <textarea
      ref={refTA}
      className="code-area"
      defaultValue={props.valueBox[0]}
      onChange={onChange}
      onInput={onInput}
      onKeyDown={onKeyDown}
    />
  );
};

export default CodeArea;
