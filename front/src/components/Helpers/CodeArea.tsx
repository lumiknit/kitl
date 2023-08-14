import { useEffect, createRef } from "react";
import "./CodeArea.css";

// Helpers

const indentTextareaContent = (content: string, start: number, end: number) => {
  // Indent selection and return new value and range
  let s = start;
  while (s > 0 && content[s - 1] !== "\n") {
    s--;
  }
  const lines = content.substring(s, end).split("\n");
  const indentedLines = lines.map(line => "  " + line);
  const indentedValue = indentedLines.join("\n");
  const newValue =
    content.substring(0, s) + indentedValue + content.substring(end);
  return {
    value: newValue,
    start: start + 2,
    end: end + 2 * lines.length,
  };
};

const outdentTextareaContent = (
  content: string,
  start: number,
  end: number,
) => {
  // Outdent selection and return new value and start and end
  let s = start;
  while (s > 0 && content[s - 1] !== "\n") {
    s--;
  }
  const lines = content.substring(s, end).split("\n");
  let newStart = start;
  let newEnd = end;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("  ")) {
      if (i === 0) newStart -= 2;
      newEnd -= 2;
      lines[i] = lines[i].substring(2);
    }
  }
  const unindented = lines.join("\n");
  const newValue =
    content.substring(0, s) + unindented + content.substring(end);
  return {
    value: newValue,
    start: newStart,
    end: newEnd,
  };
};

// Component

export type CodeAreaProps = {
  defaultValue?: string;
  onChange?: (value: string) => void;
  autoFocus?: boolean;
  errorMessage?: string;
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
};

const CodeArea = (props: CodeAreaProps) => {
  const textareaRef = props.textareaRef || createRef<HTMLTextAreaElement>();
  const hiddenTextareaRef = createRef<HTMLTextAreaElement>();

  const resizeTextarea = (target: HTMLTextAreaElement) => {
    // Resize hidden text area to match
    if (hiddenTextareaRef.current === null) return;
    hiddenTextareaRef.current.value = target.value;
    target.style.height = hiddenTextareaRef.current.scrollHeight + 2 + "px";
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    switch (event.key) {
      // Tab key
      case "Tab":
        {
          event.preventDefault();
          const target = event.currentTarget;
          const start = target.selectionStart;
          const end = target.selectionEnd;
          const value = target.value;
          let indentResult;
          if (event.shiftKey) {
            // Unindent
            indentResult = outdentTextareaContent(value, start, end);
          } else {
            // Indent
            indentResult = indentTextareaContent(value, start, end);
          }
          target.value = indentResult.value;
          target.selectionStart = indentResult.start;
          target.selectionEnd = indentResult.end;
          resizeTextarea(target);
        }
        break;
      case "Enter":
        {
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
          resizeTextarea(target);
        }
        break;
    }
  };

  const onInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
    // Resize text area
    const target = event.currentTarget;
    resizeTextarea(target);
    if (props.onChange !== undefined) {
      props.onChange(event.currentTarget.value);
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Update value
    if (props.onChange !== undefined) {
      props.onChange(event.currentTarget.value);
    }
  };

  useEffect(() => {
    if (textareaRef.current !== null) {
      resizeTextarea(textareaRef.current);
    }
  });

  const className =
    props.errorMessage !== undefined
      ? "code-area code-area-error"
      : "code-area";

  return (
    <div className="code-area">
      <textarea
        ref={textareaRef}
        className={className}
        defaultValue={props.defaultValue || ""}
        onChange={onChange}
        onInput={onInput}
        onKeyDown={onKeyDown}
        autoFocus={props.autoFocus}
      />
      {props.errorMessage !== undefined ? (
        <div className="code-area-error-msg">{props.errorMessage}</div>
      ) : null}
      <textarea
        ref={hiddenTextareaRef}
        className="code-area code-area-hidden"
      />
    </div>
  );
};

export default CodeArea;
