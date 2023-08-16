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
import toast from "react-hot-toast";
import i18n from "../../locales/i18n";
import {
  FlowContext,
  addEmptyNodeCallback,
  deleteSelectedNodesCallback,
} from "./context";
import { ReactElement, useMemo } from "react";
import { useReactFlow, useStoreApi } from "reactflow";

export type FlowEditorHeaderProps = {
  flowContext: FlowContext;
  mode: fh.EditingMode;
  updateMode: (mode: fh.EditingMode) => void;
  openBrowser: () => void;
};

const FlowEditorHeader = (props: FlowEditorHeaderProps) => {
  const storeApi = useStoreApi();
  const instance = useReactFlow();

  const undoBtn = useMemo(() => (
    <button
      key="undo"
      className={`btn btn-warning py-1 ${
        props.flowContext.undoable() ? "" : "disabled"
      }}`}
      onClick={() => {
        props.flowContext.undo(instance);
        toast("Undo");
      }}>
      <TbArrowBackUp />
    </button>
  ), [props.flowContext, props.flowContext.undoable(), instance]);

  const redoBtn = useMemo(() => (
    <button
      key="redo"
      className={`btn btn-warning py-1 ${
        props.flowContext.redoable() ? "" : "disabled"
      }}`}
      onClick={() => {
        props.flowContext.redo(instance);
        toast("Redo");
      }}>
      <TbArrowForwardUp />
    </button>
  ), [props.flowContext, props.flowContext.redoable(), instance]);

  const addBtn = useMemo(() => {
    return (<button
      key="add"
      className="btn btn-secondary flex-grow-1 px-0"
      onClick={() => {
        const center = props.flowContext.getCenter(storeApi.getState());
        props.flowContext.setNodes(instance,
          addEmptyNodeCallback(center[0], center[1]))
      }}>
      <TbSquarePlus />
    </button>);
  }, [props.flowContext, storeApi, instance]);

  const deleteBtn = useMemo(() => (
    <button
      key="del"
      className="btn btn-danger"
      onClick={() =>
        props.flowContext.setNodes(instance, deleteSelectedNodesCallback)
      }>
      <TbBackspace />
    </button>
  ), [props.flowContext, instance]);

  const editModeControls = () => {
    return [
      <button key="deselect" className="btn btn-warning py-1 px-0 flex-grow-1">
        <TbDeselect />
      </button>,
      <button key="cut" className="btn btn-secondary py-1 px-0 flex-grow-1">
        <TbScissors />
      </button>,
      <button key="copy" className="btn btn-secondary py-1 px-0 flex-grow-1">
        <TbCopy />
      </button>,
      <button key="paste" className="btn btn-secondary py-1 px-0 flex-grow-1">
        <TbClipboard />
      </button>,
      <button key="delete" className="btn btn-danger py-1 px-0 flex-grow-1">
        <TbBackspace />
      </button>,
    ];
  };

  const updateModeMenus = useMemo(() => {
    const dropDownItems = [];
    for (let i = 0; i < fh.editingModeLabels.length; i++) {
      dropDownItems.push(
        <a
          key={`mode-${i}`}
          className="dropdown-item"
          href="#"
          onClick={() => props.updateMode(i)}
        >
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
    switch(props.mode) {
      case fh.EditingMode.Add:
        controls = [
          undoBtn,
          redoBtn,
          addBtn,
          deleteBtn,
        ];
        break;
      case fh.EditingMode.Selection:
        controls = editModeControls();
        break;
    }

    // Convert to drop down menu
    const dropDownMenu = (
      <ul className="dropdown-menu">
        {updateModeMenus}
        <hr />
        <a className="dropdown-item" href="#" onClick={() => props.openBrowser()}>
          <TbFolderSearch />
          &nbsp;
          {i18n.t("flowEditor.menu.browser")}
        </a>
        <hr />
        <a className="dropdown-item" href="#">
          <TbRocket />
          &nbsp;
          {i18n.t("flowEditor.menu.launch")}
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
  }, [props.mode, props.updateMode, props.openBrowser, undoBtn, redoBtn, addBtn, deleteBtn, updateModeMenus]);
};

export default FlowEditorHeader;
