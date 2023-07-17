import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboard,
  faCodeFork,
  faCommentDots,
  faCopy,
  faDeleteLeft,
  faFileLines,
  faPaste,
  faRotateLeft,
  faRotateRight,
  faScissors,
  faSquareCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import * as fh from "./helper";

export type FlowEditorHeaderProps = {
  mode: fh.EditingMode;
  updateMode: (mode: fh.EditingMode) => void;
  addNode: (type: string, data: any) => void;
  deleteSelectedNode: () => void;
};

const fileModeControls = () => {
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
      <FontAwesomeIcon icon={faSquareCaretDown} />
    </button>,
    <button
      key="mem"
      className="btn btn-outline-primary flex-grow-1 px-0"
      onClick={() => props.addNode("mem", null)}>
      <FontAwesomeIcon icon={faClipboard} />
    </button>,
    <button
      key="select"
      className="btn btn-outline-danger flex-grow-1 px-0"
      onClick={() => props.addNode("select", null)}>
      <FontAwesomeIcon icon={faCodeFork} />
    </button>,
    <button
      key="const"
      className="btn btn-outline-warning flex-grow-1 px-0"
      onClick={() => props.addNode("const", null)}>
      <FontAwesomeIcon icon={faFileLines} />
    </button>,
    <button
      key="comment"
      className="btn btn-outline-success flex-grow-1 px-0"
      onClick={() =>
        props.addNode("comment", "**Double click** to edit *MD* comment")
      }>
      <FontAwesomeIcon icon={faCommentDots} />
    </button>,
    <button
      key="del"
      className="btn btn-danger"
      onClick={props.deleteSelectedNode}>
      <FontAwesomeIcon icon={faDeleteLeft} />
    </button>,
  ];
};

const editModeControls = () => {
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
      <FontAwesomeIcon icon={faPaste} />
    </button>,
    <button key="delete" className="btn btn-danger py-1 px-0 flex-grow-1">
      <FontAwesomeIcon icon={faDeleteLeft} />
    </button>,
  ];
};

const controls = (props: FlowEditorHeaderProps) => {
  switch (props.mode) {
    case fh.EditingMode.File:
      return fileModeControls();
    case fh.EditingMode.AddNode:
      return addNodeModeControls(props);
    case fh.EditingMode.Edit:
      return editModeControls();
    default:
      return <></>;
  }
};

const FlowEditorHeader = (props: FlowEditorHeaderProps) => {
  // Menu button
  const menuButton = (
    <button className="btn btn-primary" data-bs-toggle="dropdown">
      <FontAwesomeIcon icon={fh.editingModeIcons[props.mode]} />
    </button>
  );
  // Drop down menu
  const dropDownItems = [];
  // Insert modes to dropdown menu
  for (let i = 0; i < fh.editingModeLabels.length; i++) {
    dropDownItems.push(
      <a className="dropdown-item" href="#" onClick={() => props.updateMode(i)}>
        <FontAwesomeIcon icon={fh.editingModeIcons[i]} />
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
