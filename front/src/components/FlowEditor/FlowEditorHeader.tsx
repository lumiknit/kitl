import {
  TbArrowBackUp,
  TbArrowForwardUp,
  TbBackspace,
  TbScissors,
  TbSquarePlus,
  TbCopy,
  TbClipboard,
  TbFolderSearch,
  TbRocket,
  TbDeselect,
} from "react-icons/tb";

import * as fh from "./helper";
import { emptyBetaNode } from "../../common/node";
import toast from "react-hot-toast";
import i18n from "../../locales/i18n";

export type FlowEditorHeaderProps = {
  mode: fh.EditingMode;
  updateMode: (mode: fh.EditingMode) => void;
  addNode: (type: string, data: any) => void;
  deleteSelectedNode: () => void;
  openBrowser: () => void;
};

const addNodeModeControls = (props: FlowEditorHeaderProps) => {
  return [
    <button
      key="undo"
      className="btn btn-warning py-1"
      onClick={() => toast("BOOM")}>
      <TbArrowBackUp />
    </button>,
    <button key="redo" className="btn btn-warning py-1 ">
      <TbArrowForwardUp />
    </button>,
    <button
      key="beta"
      className="btn btn-secondary flex-grow-1 px-0"
      onClick={() => props.addNode("beta", emptyBetaNode())}>
      <TbSquarePlus />
    </button>,
    <button
      key="del"
      className="btn btn-danger"
      onClick={props.deleteSelectedNode}>
      <TbBackspace />
    </button>,
  ];
};

const editModeControls = () => {
  return [
    <button
      key="deselect"
      className="btn btn-warning py-1 px-0 flex-grow-1">
      <TbDeselect />
    </button>,
    <button
      key="cut"
      className="btn btn-secondary py-1 px-0 flex-grow-1">
      <TbScissors />
    </button>,
    <button
      key="copy"
      className="btn btn-secondary py-1 px-0 flex-grow-1">
      <TbCopy />
    </button>,
    <button
      key="paste"
      className="btn btn-secondary py-1 px-0 flex-grow-1">
      <TbClipboard />
    </button>,
    <button key="delete" className="btn btn-danger py-1 px-0 flex-grow-1">
      <TbBackspace />
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
      {fh.editingModeIcons[props.mode]}
    </button>
  );
  // Drop down menu
  const dropDownItems = [];
  // Insert modes to dropdown menu
  for (let i = 0; i < fh.editingModeLabels.length; i++) {
    dropDownItems.push(
      <a className="dropdown-item" href="#" onClick={() => props.updateMode(i)}>
        {fh.editingModeIcons[i]}
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
      <TbFolderSearch />
      &nbsp;
      {i18n.t("flowEditor.menu.browser")}
    </a>,
  );
  dropDownItems.push(<hr />);
  dropDownItems.push(
    <a className="dropdown-item" href="#">
      <TbRocket />
      &nbsp;
      {i18n.t("flowEditor.menu.launch")}
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
