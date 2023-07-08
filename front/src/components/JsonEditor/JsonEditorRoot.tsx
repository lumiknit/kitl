import CodeArea from "../CodeArea/CodeArea";

import JsonEditorHeader from "./JsonEditorHeader";
import { useJsonEditorContext } from "./JsonEditorProvider";
import JsonItem from "./JsonItem";

const JsonEditorRoot = () => {
  console.log("[RENDER] JsonEditorRoot");
  const ctx = useJsonEditorContext();
  let body = undefined;
  if(ctx.isTextMode()) {
    const defaultValue = JSON.stringify(ctx.value.edit.value, undefined, 2);
    const onChange = (value: string) => {
      console.log("Changed:", value);
      try {
        const newValue = JSON.parse(value);
        ctx.value.edit.update([], newValue);
        ctx.value.textModeError = undefined;
        ctx.updated();
      } catch(e) {
        if(e instanceof SyntaxError) {
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
    body = (
      <JsonItem
        path={[]}
        value={ctx.value.edit.value}
      />
    );
  }
  return (
    <div className="json-editor">
      <JsonEditorHeader />
      <div className="json-editor-body">
        {body}
      </div>
    </div>
  );
  /*return (
    <div className="json-editor">
      <JsonEditorHeader
        path={state.path}
        mode={state.mode}
        updateMode={updateMode}
        showStringEscape={state.showStringEscape}
        toggleStringEscape={toggleStringEscape}
        downloadJson={() => {
          const filename = getFilenameFromState(state);
          const content = JSON.stringify(props.valueBox[0]);
          utils.downloadTextFile(filename, content);
        }}
      />
      <div className="json-editor-body">
        {jc.isTextMode(state.mode) ? (
          <JsonTextArea value={props.valueBox[0]} updateValue={updateValue} />
        ) : (
          <JsonItem
            position={new jh.Position(0, "", "")}
            updateIndex={() => {
              alert("Cannot update index of root object!");
              throw new Error("Cannot update index of root object!");
            }}
            value={props.valueBox[0]}
            updateValue={updateValue}
            config={config}
          />
        )}
      </div>
    </div>
  );*/
};

export default JsonEditorRoot;