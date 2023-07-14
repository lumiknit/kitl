import CodeArea from "../CodeArea/CodeArea";

import JsonEditorHeader from "./JsonEditorHeader";
import { useJsonEditorContext } from "./JsonEditorProvider";
import JsonItem from "./JsonItem";

const JsonEditorRoot = () => {
  console.log("[RENDER] JsonEditorRoot");
  const ctx = useJsonEditorContext();
  let body = undefined;
  if (ctx.isTextMode()) {
    const defaultValue = JSON.stringify(ctx.value.edit.value, undefined, 2);
    const onChange = (value: string) => {
      try {
        const newValue = JSON.parse(value);
        ctx.value.edit.update([], newValue);
        ctx.value.textModeError = undefined;
        ctx.updated();
      } catch (e) {
        if (e instanceof SyntaxError) {
          ctx.value.textModeError = e.message;
          ctx.updated();
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
        errorMsg={ctx.value.textModeError}
      />
    );
  } else {
    body = <JsonItem path={[]} value={ctx.value.edit.value} />;
  }
  return (
    <div className="json-editor">
      <JsonEditorHeader />
      <div className="json-editor-body">{body}</div>
    </div>
  );
};

export default JsonEditorRoot;
