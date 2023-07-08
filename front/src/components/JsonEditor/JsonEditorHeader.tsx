import { useMemo } from "react";
import BI from "../Util/BI";
import BICheckBox from "../Util/BICheckBox";

import * as jctx from "./JsonEditorContext";
import { useJsonEditorContext } from "./JsonEditorProvider";

const menuButton = (ctx: jctx.JsonEditorContext) => {
  const mode = ctx.value.editMode;
  return (
    <button className="btn btn-primary" data-bs-toggle="dropdown">
      <BI iconName={jctx.editModeIcons[mode]} />
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
        <BI iconName={icon} />
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
      <BICheckBox checked={ctx.value.showStringEscape} />
      &nbsp; Show string escapes
    </a>
  );
  menus.push(
    <a className="dropdown-item" href="#" onClick={ctx.downloadJson}>
      <BI iconName="download" />
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
      <BI iconName="arrow-clockwise" />
    </button>,
    <button key="2" className="btn btn-secondary">
      <BI iconName="save" />
    </button>,
  ];
};

const editControls = (ctx: jctx.JsonEditorContext) => {
  return [
    <button key="undo" className="btn btn-warning py-1 px-0 flex-grow-1">
      <BI iconName="arrow-counterclockwise" />
    </button>,
    <button key="redo" className="btn btn-warning py-1 px-0 flex-grow-1">
      <BI iconName="arrow-clockwise" />
    </button>,
    <button
      key="cut"
      className="btn btn-outline-secondary py-1 px-0 flex-grow-1">
      <BI iconName="scissors" />
    </button>,
    <button
      key="copy"
      className="btn btn-outline-secondary py-1 px-0 flex-grow-1">
      <BI iconName="files" />
    </button>,
    <button
      key="paste"
      className="btn btn-outline-secondary py-1 px-0 flex-grow-1">
      <BI iconName="clipboard" />
    </button>,
    <button key="delete" className="btn btn-danger py-1 px-0 flex-grow-1">
      <BI iconName="trash" />
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
