import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentDots,
  faCopy,
  faDeleteLeft,
  faFolderTree,
  faPaste,
  faRocket,
  faRotateLeft,
  faRotateRight,
  faScissors,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";
import * as fh from "./helper";
import {
  emptyBetaNode,
  emptyCommentNode,
  emptyLambdaNode,
} from "../../common/node";

export type FlowEditorHeaderProps = {
  mode: fh.EditingMode;
  updateMode: (mode: fh.EditingMode) => void;
  addNode: (type: string, data: any) => void;
  deleteSelectedNode: () => void;
  openBrowser: () => void;
};

const addNodeModeControls = (props: FlowEditorHeaderProps) => {
  return [
    <button key="undo" className="btn btn-warning py-1">
      <FontAwesomeIcon icon={faRotateLeft} />
    </button>,
    <button key="redo" className="btn btn-warning py-1 ">
      <FontAwesomeIcon icon={faRotateRight} />
    </button>,
    <button
      key="beta"
      className="btn btn-secondary flex-grow-1 px-0"
      onClick={() => props.addNode("beta", emptyBetaNode())}>
      <FontAwesomeIcon icon={faSquarePlus} />
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
    case fh.EditingMode.Add:
      return addNodeModeControls(props);
    case fh.EditingMode.Selection:
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
      </a>,
    );
  }
  // Insert separator
  dropDownItems.push(<hr />);
  // Insert browser button
  dropDownItems.push(
    <a className="dropdown-item" href="#" onClick={() => props.openBrowser()}>
      <FontAwesomeIcon icon={faFolderTree} />
      &nbsp;
      {"Browser"}
    </a>,
  );
  dropDownItems.push(<hr />);
  dropDownItems.push(
    <a className="dropdown-item" href="#">
      <FontAwesomeIcon icon={faRocket} />
      &nbsp;
      {"Launch"}
    </a>,
  );
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
