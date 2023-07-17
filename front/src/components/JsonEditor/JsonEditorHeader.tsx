import React, { useMemo } from "react";

import * as jctx from "./JsonEditorContext";
import * as je from "./edit";
import { useJsonEditorContext } from "./JsonEditorProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faClipboard,
  faCopy,
  faDeleteLeft,
  faDownload,
  faRotateLeft,
  faRotateRight,
  faScissors,
  faSquare,
  faSquareCheck,
} from "@fortawesome/free-solid-svg-icons";

export type JsonEditorHeaderProps = {
  editing: je.JsonEdit;
  updateEditing: (f: je.UpdateEdit) => void;
};

const MenuButton = () => {
  const ctx = useJsonEditorContext();
  const mode = ctx.value.editMode;
  return useMemo(
    () => (
      <button className="btn btn-primary" data-bs-toggle="dropdown">
        <FontAwesomeIcon icon={jctx.editModeIcons[mode]} />
      </button>
    ),
    [mode],
  );
};

const DropDownMenu = (props: JsonEditorHeaderProps) => {
  const ctx = useJsonEditorContext();
  const downloadJson = () => {
    const v = JSON.stringify(props.editing.value, undefined, 2);
    const blob = new Blob([v], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const filename = ctx.value.path.replace(/[`~!@#$%^&\\|<>/?'":;]/, "_");
    a.download = `${filename}.json`;
    a.click();
  };

  return useMemo(() => {
    const menus = [];
    for (let i = 0; i < jctx.editModeLabels.length; i++) {
      const label = jctx.editModeLabels[i];
      const icon = jctx.editModeIcons[i];
      menus.push(
        <a className="dropdown-item" href="#" onClick={() => ctx.updateMode(i)}>
          <FontAwesomeIcon icon={icon} />
          &nbsp;
          {label}
        </a>,
      );
    }
    menus.push(<hr />);
    menus.push(
      <a
        className="dropdown-item"
        href="#"
        onClick={() => ctx.toggleStringEscape()}>
        <FontAwesomeIcon
          icon={ctx.value.showStringEscape ? faSquareCheck : faSquare}
        />
        &nbsp; Show string escapes
      </a>,
    );
    menus.push(
      <a className="dropdown-item" href="#" onClick={downloadJson}>
        <FontAwesomeIcon icon={faDownload} />
        &nbsp; Download
      </a>,
    );
    return (
      <ul className="dropdown-menu">
        {menus.map((menu, idx) => (
          <li key={idx}>{menu}</li>
        ))}
      </ul>
    );
  }, [ctx.value.showStringEscape, ctx.toggleStringEscape]);
};

const fileControls = (
  ctx: jctx.JsonEditorContext,
  props: JsonEditorHeaderProps,
) => {
  return [
    <input
      key="0"
      type="text"
      className="form-control"
      placeholder="Path"
      value={ctx.value.path}
      disabled
    />,
    <button
      key="btn-close"
      className="btn btn-success"
      onClick={() => {
        if (ctx.value.close !== undefined) {
          ctx.value.close(props.editing.value);
        }
      }}>
      <FontAwesomeIcon icon={faCheck} />
    </button>,
  ];
};

const editControls = (props: JsonEditorHeaderProps) => {
  const undoable = je.undoable(props.editing);
  const redoable = je.redoable(props.editing);
  const undo = () => {
    props.updateEditing(je.undo);
  };
  const redo = () => {
    props.updateEditing(je.redo);
  };
  return [
    <button
      key="undo"
      className="btn btn-warning py-1 px-0 flex-grow-1"
      disabled={!undoable}
      onClick={undo}>
      <FontAwesomeIcon icon={faRotateLeft} />
    </button>,
    <button
      key="redo"
      className="btn btn-warning py-1 px-0 flex-grow-1"
      disabled={!redoable}
      onClick={redo}>
      <FontAwesomeIcon icon={faRotateRight} />
    </button>,
    <button
      key="cut"
      className="btn btn-outline-secondary py-1 px-0 flex-grow-1">
      <FontAwesomeIcon icon={faScissors} />
    </button>,
    <button
      key="copy"
      className="btn btn-outline-secondary py-1 px-0 flex-grow-1">
      <FontAwesomeIcon icon={faCopy} />
    </button>,
    <button
      key="paste"
      className="btn btn-outline-secondary py-1 px-0 flex-grow-1">
      <FontAwesomeIcon icon={faClipboard} />
    </button>,
    <button key="delete" className="btn btn-danger py-1">
      <FontAwesomeIcon icon={faDeleteLeft} />
    </button>,
  ];
};

const Controls = React.memo((props: JsonEditorHeaderProps) => {
  const ctx = useJsonEditorContext();
  const mode = ctx.value.editMode;
  switch (mode) {
    case jctx.EditMode.Text:
    case jctx.EditMode.Tree:
      return fileControls(ctx, props);
    case jctx.EditMode.Edit:
      return editControls(props);
  }
});

const JsonEditorHeader = (props: JsonEditorHeaderProps) => {
  return (
    <div className="json-editor-header">
      <div className="input-group shadow">
        <MenuButton />
        <DropDownMenu {...props} />
        <Controls {...props} />
      </div>
    </div>
  );
};

export default JsonEditorHeader;
