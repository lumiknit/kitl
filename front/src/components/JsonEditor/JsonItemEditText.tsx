import { useState, useEffect, createRef } from "react";

type JsonItemEditTextProps = {
  value: string;
  updateValue: (value: string) => boolean;
};

type JsonItemEditTextState = {
  value: string;
  lastPropValue: string;
  editing: boolean;
};

const JsonItemEditText = (props: JsonItemEditTextProps) => {
  const [state, setState] = useState<JsonItemEditTextState>({
    value: props.value,
    lastPropValue: props.value,
    editing: false,
  });

  if (props.value !== state.lastPropValue) {
    setState({
      value: props.value,
      lastPropValue: props.value,
      editing: false,
    });
  }

  const ref = createRef<HTMLTextAreaElement>();
  const resizeTextArea = () => {
    if (ref.current === null) return;
    const target = ref.current;
    target.style.height = "0";
    target.style.height = target.scrollHeight + 2 + "px";
  };

  useEffect(() => {
    resizeTextArea();
  });

  if (state.editing) {
    const discardChanges = () => {
      const s = { ...state };
      s.editing = false;
      setState(s);
    };

    const onInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      if (props.updateValue(e.currentTarget.value)) {
        state.value = e.currentTarget.value;
      }
      resizeTextArea();
    };

    return (
      <textarea
        ref={ref}
        className="form-control py-1 json-item-edit-text-area"
        defaultValue={state.value}
        onBlur={discardChanges}
        onInput={onInput}
        autoFocus={true}
        placeholder="empty"
      />
    );
  } else {
    const enterEditMode = () => {
      const s = { ...state };
      s.editing = true;
      setState(s);
    };
    return (
      <div
        className="form-control py-1 json-item-edit-text"
        onClick={enterEditMode}
      >
        {state.value === "" ? (
          <span className="text-muted">empty</span>
        ) : (
          <pre className="m-0">{state.value}</pre>
        )}
      </div>
    );
  }
};

export default JsonItemEditText;
