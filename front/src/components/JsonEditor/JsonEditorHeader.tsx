import { useMemo } from "react";

import * as jctx from "./JsonEditorContext";
import { useJsonEditorContext } from "./JsonEditorProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faArrowsRotate, faClipboard, faCopy, faDeleteLeft, faDownload, faFloppyDisk, faRotateLeft, faRotateRight, faScissors, faSquare, faSquareCheck } from "@fortawesome/free-solid-svg-icons";

const menuButton = (ctx: jctx.JsonEditorContext) => {
  const mode = ctx.value.editMode;
  return (
    <button className="btn btn-primary" data-bs-toggle="dropdown">
      <FontAwesomeIcon icon={jctx.editModeIcons[mode]} />
    </button>
  );
};

const dropDownMenu = (ctx: jctx.JsonEditorContext) => {
  const menus = [
  ];
  for(let i = 0; i < jctx.editModeLabels.length; i++) {
    const label = jctx.editModeLabels[i];
    const icon = jctx.editModeIcons[i];
    menus.push(
      <a
        className="dropdown-item"
        href="#"
        onClick={() => ctx.updateMode(i)}>
        <FontAwesomeIcon icon={icon} />
        &nbsp;
        {label}
      </a>
    );
  }
  menus.push(<hr />);
  menus.push(
    <a
      className="dropdown-item"
      href="#"
      onClick={() => ctx.toggleStringEscape()}>
      <FontAwesomeIcon icon={ctx.value.showStringEscape ? faSquareCheck : faSquare} />
      &nbsp; Show string escapes
    </a>
  );
  menus.push(
    <a className="dropdown-item" href="#" onClick={ctx.downloadJson}>
      <FontAwesomeIcon icon={faDownload} />
      &nbsp; Download
    </a>
  );
  return (
    <ul className="dropdown-menu">
      {
        menus.map((menu, idx) => (
          <li key={idx}>
            {menu}
          </li>
        ))
      }
    </ul>
  )
};

const fileControls = (ctx: jctx.JsonEditorContext) => {
  return [
    <input
      key="0"
      type="text"
      className="form-control"
      placeholder="Path"
      value={ctx.value.path}
      disabled
    />,
    <button key="1" className="btn btn-secondary">
      <FontAwesomeIcon icon={faArrowsRotate} />
    </button>,
    <button key="2" className="btn btn-secondary">
      <FontAwesomeIcon icon={faFloppyDisk} />
    </button>,
  ];
};

const editControls = (ctx: jctx.JsonEditorContext) => {
  return [
    <button key="undo" className="btn btn-warning py-1 px-0 flex-grow-1">
      <FontAwesomeIcon icon={faRotateLeft} />
    </button>,
    <button key="redo" className="btn btn-warning py-1 px-0 flex-grow-1">
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
    <button key="delete" className="btn btn-danger py-1 px-0 flex-grow-1">
      <FontAwesomeIcon icon={faDeleteLeft} />
    </button>,
  ];
};

const controls = (ctx: jctx.JsonEditorContext) => {
  const mode = ctx.value.editMode;
  switch (mode) {
  case jctx.EditMode.Text:
  case jctx.EditMode.Tree:
    return fileControls(ctx);
  case jctx.EditMode.Edit:
    return editControls(ctx);
  }
};

const JsonEditorHeader = () => {
  const ctx = useJsonEditorContext();
  return useMemo(
    () => {
      console.log("[RENDER] JsonEditorHeader");
      return (
        <div className="json-editor-header">
          <div className="input-group shadow-sm">
            {menuButton(ctx)}
            {dropDownMenu(ctx)}
            {controls(ctx)}
          </div>
        </div>
      );
    },
    [
      ctx.value.editMode,
      ctx.value.path,
      ctx.value.showStringEscape,
    ],
  );
};

export default JsonEditorHeader;
