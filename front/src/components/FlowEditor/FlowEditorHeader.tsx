import BI from "../Util/BI";

import * as fh from "./helper";

export type FlowEditorHeaderProps = {
  mode: fh.EditingMode;
  updateMode: (mode: fh.EditingMode) => void;
  addNode: (type: string, data: any) => void;
  deleteSelectedNode: () => void;
};

const fileModeControls = (_props: FlowEditorHeaderProps) => {
  return [<input key="0" type="text" className="form-control" />];
};

const addNodeModeControls = (props: FlowEditorHeaderProps) => {
  return [
    <button
      key="op"
      className="btn btn-outline-secondary flex-grow-1 px-0"
      onClick={() =>
        props.addNode("op", {
          module: "",
          name: "op",
        })
      }>
      <BI iconName="code-square" />
    </button>,
    <button
      key="mem"
      className="btn btn-outline-primary flex-grow-1 px-0"
      onClick={() => props.addNode("mem", null)}>
      <BI iconName="clipboard" />
    </button>,
    <button
      key="select"
      className="btn btn-outline-danger flex-grow-1 px-0"
      onClick={() => props.addNode("select", null)}>
      <BI iconName="toggles2" />
    </button>,
    <button
      key="const"
      className="btn btn-outline-secondary flex-grow-1 px-0"
      onClick={() => props.addNode("const", null)}>
      <BI iconName="filetype-json" />
    </button>,
    <button
      key="comment"
      className="btn btn-outline-success flex-grow-1 px-0"
      onClick={() =>
        props.addNode("comment", "**Double click** to edit *MD* comment")
      }>
      <BI iconName="chat-square-dots" />
    </button>,
    <button
      key="del"
      className="btn btn-danger"
      onClick={props.deleteSelectedNode}>
      <BI iconName="trash" />
    </button>,
  ];
};

const editModeControls = (_props: FlowEditorHeaderProps) => {
  return [
    <button key="undo" className="btn btn-warning py-1 px-0 flex-grow-1">
      <BI iconName="arrow-counterclockwise" />
    </button>,
    <button key="redo" className="btn btn-warning py-1 px-0 flex-grow-1">
      <BI iconName="arrow-clockwise" />
    </button>,
    <button key="cut" className="btn btn-outline-secondary py-1 px-0 flex-grow-1">
      <BI iconName="scissors" />
    </button>,
    <button key="copy" className="btn btn-outline-secondary py-1 px-0 flex-grow-1">
      <BI iconName="files" />
    </button>,
    <button key="paste" className="btn btn-outline-secondary py-1 px-0 flex-grow-1">
      <BI iconName="clipboard" />
    </button>,
    <button key="delete" className="btn btn-danger py-1 px-0 flex-grow-1">
      <BI iconName="trash" />
    </button>,
  ];
};

const controls = (props: FlowEditorHeaderProps) => {
  switch (props.mode) {
    case fh.EditingMode.File:
      return fileModeControls(props);
    case fh.EditingMode.AddNode:
      return addNodeModeControls(props);
    case fh.EditingMode.Edit:
      return editModeControls(props);
    default:
      return <></>;
  }
};

const FlowEditorHeader = (props: FlowEditorHeaderProps) => {
  // Menu button
  const menuButton = (
    <button className="btn btn-primary" data-bs-toggle="dropdown">
      <BI iconName={fh.editingModeIcons[props.mode]} />
    </button>
  );
  // Drop down menu
  const dropDownItems = [];
  // Insert modes to dropdown menu
  for (let i = 0; i < fh.editingModeLabels.length; i++) {
    dropDownItems.push(
      <a className="dropdown-item" href="#" onClick={() => props.updateMode(i)}>
        <BI iconName={fh.editingModeIcons[i]} />
        &nbsp;
        {fh.editingModeLabels[i]}
      </a>
    );
  }
  // Insert separator
  dropDownItems.push(<hr />);
  // Convert to drop down menu
  const dropDownMenu = (
    <ul className="dropdown-menu">
      {dropDownItems.map((item, idx) => {
        return <li key={idx}>{item}</li>;
      })}
    </ul>
  );
  return (
    <div className="flow-editor-header">
      <div className="input-group shadow-sm">
        {menuButton}
        {dropDownMenu}
        {controls(props)}
      </div>
    </div>
  );
};

export default FlowEditorHeader;
