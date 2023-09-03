import {
  TbArrowBackUp,
  TbBackspace,
  TbScissors,
  TbSquarePlus,
  TbCopy,
  TbClipboard,
  TbFolderSearch,
  TbRocket,
  TbDeselect,
  TbArrowForwardUp,
  TbBinaryTree,
} from "react-icons/tb";

import * as fh from "./helper";
import toast from "react-hot-toast";
import i18n from "../../locales/i18n";
import { FlowContext, FlowContextI } from "./context";
import { ReactElement, useMemo } from "react";
import { useReactFlow, useStoreApi } from "reactflow";

export type FlowEditorHeaderProps = {
  flowContext: FlowContext;
  mode: fh.EditingMode;
  updateMode: (mode: fh.EditingMode) => void;
  openBrowser: () => void;
  openGraphTools: () => void;
};

const FlowEditorHeader = (props: FlowEditorHeaderProps) => {
  const storeApi = useStoreApi();
  const instance = useReactFlow();
  const ctxI = useMemo<FlowContextI>(
    () => new FlowContextI(props.flowContext, instance, storeApi),
    [props.flowContext, instance, storeApi],
  );

  const undoBtn = useMemo(
    () => (
      <button
        key="undo"
        className="btn btn-warning py-1"
        onClick={() => {
          if (ctxI.undo()) {
            toast(i18n.t("flowEditor.toast.undo"), {
              duration: 500,
            });
          } else {
            toast.error(i18n.t("flowEditor.toast.nothingToUndo"));
          }
        }}>
        <TbArrowBackUp />
      </button>
    ),
    [ctxI],
  );

  const redoBtn = useMemo(
    () => (
      <button
        key="redo"
        className="btn btn-warning py-1"
        onClick={() => {
          if (ctxI.redo()) {
            toast(i18n.t("flowEditor.toast.redo"), {
              duration: 500,
            });
          } else {
            toast.error(i18n.t("flowEditor.toast.nothingToRedo"));
          }
        }}>
        <TbArrowForwardUp />
      </button>
    ),
    [ctxI],
  );

  const addBtn = useMemo(() => {
    return (
      <button
        key="add"
        className="btn btn-secondary flex-grow-1 px-0"
        onClick={() => ctxI.addEmptyNode()}>
        <TbSquarePlus />
      </button>
    );
  }, [ctxI]);

  const deleteBtn = useMemo(
    () => (
      <button
        key="del"
        className="btn btn-danger flex-grow-1 px-0"
        onClick={() => ctxI.deleteSelected()}>
        <TbBackspace />
      </button>
    ),
    [ctxI],
  );

  const deselectAllBtn = useMemo(
    () => (
      <button
        key="deselect"
        className="btn btn-warning py-1 px-0 flex-grow-1"
        onClick={() => ctxI.deselectAll()}>
        <TbDeselect />
      </button>
    ),
    [ctxI],
  );

  const cutBtn = useMemo(
    () => (
      <button
        key="cut"
        className="btn btn-secondary py-1 px-0 flex-grow-1"
        onClick={() => {
          if (ctxI.cutSelected()) {
            toast(i18n.t("flowEditor.toast.cut"));
          } else {
            toast.error(i18n.t("flowEditor.toast.nothingToCut"));
          }
        }}>
        <TbScissors />
      </button>
    ),
    [ctxI],
  );

  const copyBtn = useMemo(
    () => (
      <button
        key="copy"
        className="btn btn-secondary py-1 px-0 flex-grow-1"
        onClick={() => {
          if (ctxI.copySelected()) {
            toast(i18n.t("flowEditor.toast.copy"));
          } else {
            toast.error(i18n.t("flowEditor.toast.nothingToCopy"));
          }
        }}>
        <TbCopy />
      </button>
    ),
    [ctxI],
  );

  const pasteBtn = useMemo(
    () => (
      <button
        key="paste"
        className="btn btn-secondary py-1 px-0 flex-grow-1"
        onClick={async () => {
          if (await ctxI.paste()) {
            toast(i18n.t("flowEditor.toast.paste"));
          } else {
            toast.error(i18n.t("flowEditor.toast.nothingToPaste"));
          }
        }}>
        <TbClipboard />
      </button>
    ),
    [ctxI],
  );

  const updateModeMenus = useMemo(() => {
    const dropDownItems = [];
    for (let i = 0; i < fh.editingModeLabels.length; i++) {
      dropDownItems.push(
        <a
          key={`mode-${i}`}
          className="dropdown-item"
          href="#"
          onClick={() => props.updateMode(i)}>
          {fh.editingModeIcons[i]}
          &nbsp;
          {fh.editingModeLabels[i]}
        </a>,
      );
    }
    return dropDownItems;
  }, [props.updateMode]);

  return useMemo(() => {
    let controls: ReactElement[] = [];
    switch (props.mode) {
      case fh.EditingMode.Add:
        controls = [undoBtn, redoBtn, addBtn, deleteBtn];
        break;
      case fh.EditingMode.Selection:
        controls = [deselectAllBtn, cutBtn, copyBtn, pasteBtn, deleteBtn];
        break;
    }

    // Convert to drop down menu
    const dropDownMenu = (
      <ul className="dropdown-menu">
        {updateModeMenus}
        <hr />
        <a
          className="dropdown-item"
          href="#"
          onClick={() => props.openBrowser()}>
          <TbFolderSearch />
          &nbsp;
          {i18n.t("flowEditor.menu.browser")}
        </a>
        <a className="dropdown-item" href="#">
          <TbRocket />
          &nbsp;
          {i18n.t("flowEditor.menu.launch")}
        </a>
        <a
          className="dropdown-item"
          href="#"
          onClick={() => props.openGraphTools()}>
          <TbBinaryTree />
          &nbsp;
          {i18n.t("flowEditor.menu.graphTools")}
        </a>
      </ul>
    );
    return (
      <div className="flow-editor-header">
        <div className="input-group shadow-sm">
          <button className="btn btn-primary" data-bs-toggle="dropdown">
            {fh.editingModeIcons[props.mode]}
          </button>
          {dropDownMenu}
          {controls}
        </div>
      </div>
    );
  }, [
    props.mode,
    props.updateMode,
    props.openBrowser,
    undoBtn,
    redoBtn,
    addBtn,
    deleteBtn,
    updateModeMenus,
  ]);
};

export default FlowEditorHeader;
