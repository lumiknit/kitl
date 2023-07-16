import { useState } from "react";

import CodeArea from "../CodeArea/CodeArea";

import * as je from "./edit";
import JsonEditorHeader from "./JsonEditorHeader";
import { useJsonEditorContext } from "./JsonEditorProvider";
import JsonItem from "./JsonItem";

export type JsonEditorRootProps = {
  editing: je.JsonEdit;
  updateEditing: (f: je.UpdateEdit) => void;
};

const JsonEditorRoot = (props: JsonEditorRootProps) => {
  const ctx = useJsonEditorContext();
  let body = undefined;
  const [textModeError, setTextModeError] = useState<string | undefined>(
    undefined
  );
  if (ctx.isTextMode()) {
    const defaultValue = JSON.stringify(props.editing.value, undefined, 2);
    const onChange = (value: string) => {
      try {
        const newValue = JSON.parse(value);
        props.updateEditing(
          je.applyJsonEdit([new je.UpdateAction([], newValue)])
        );
        setTextModeError(undefined);
      } catch (e) {
        if (e instanceof SyntaxError) {
          setTextModeError(e.message);
        } else {
          console.error(e);
        }
      }
    };
    body = (
      <CodeArea
        defaultValue={defaultValue}
        onChange={onChange}
        autoFocus
        errorMsg={textModeError}
      />
    );
  } else {
    body = (
      <JsonItem
        path={[]}
        value={props.editing.value}
        updateEditing={props.updateEditing}
      />
    );
  }
  return (
    <div className="json-editor">
      <JsonEditorHeader
        editing={props.editing}
        updateEditing={props.updateEditing}
      />
      <div className="json-editor-body">{body}</div>
    </div>
  );
};

export default JsonEditorRoot;
