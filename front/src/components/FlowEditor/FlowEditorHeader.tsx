import BI from "../Util/BI";

import * as fh from "./helper";

export type FlowEditorHeaderProps = {
  mode: fh.EditingMode;
  updateMode: (mode: fh.EditingMode) => void;
  addNode: (type: string, data: any) => void;
};

const fileModeControls = (_props: FlowEditorHeaderProps) => {
  return [<input key="0" type="text" className="form-control" />];
};

const addNodeModeControls = (props: FlowEditorHeaderProps) => {
  return [
    <button
      key="fn"
      className="btn btn-outline-secondary flex-grow-1 px-0"
      onClick={() => props.addNode("op", "f")}>
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
      onClick={() => props.addNode("const", "abc\tasd\naskdl")}>
      <BI iconName="filetype-json" />
    </button>,
    <button
      key="comment"
      className="btn btn-outline-success flex-grow-1 px-0"
      onClick={() =>
        props.addNode(
          "comment",
          `
# abc
Hello, world! **boom** test \`abc\`
\`\`\`json
{
  "abc": 123
}
\`\`\`
      `
        )
      }>
      <BI iconName="chat-square-dots" />
    </button>,
    <button key="del" className="btn btn-danger">
      <BI iconName="trash" />
    </button>,
  ];
};

const editModeControls = (_props: FlowEditorHeaderProps) => {
  return [
    <button key="0" className="btn btn-secondary">
      <BI iconName="arrow-clockwise" />
    </button>,
    <button key="1" className="btn btn-secondary">
      <BI iconName="save" />
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
