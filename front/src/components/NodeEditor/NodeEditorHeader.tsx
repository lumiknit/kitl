import {
  TbEdit,
  TbCheck,
  TbTrash,
  TbMessage,
  TbJson,
  TbBeta,
  TbLambda,
} from "react-icons/tb";

import * as node from "../../common/node";
import RadioButtons from "../Helpers/RadioButtons";
import i18n from "../../locales/i18n";
import { Callbacks } from "./types";
import { memo } from "react";

export type NodeEditorHeaderProps = {
  callbacks: Callbacks;
  editingType: node.NodeType;
  onEditingTypeChange: (ty: node.NodeType) => void;
};

const typeButtonList = [
  {
    type: node.NodeType.Comment,
    colorClass: "success",
    body: <TbMessage />,
  },
  {
    type: node.NodeType.Literal,
    colorClass: "primary",
    body: <TbJson />,
  },
  {
    type: node.NodeType.Lambda,
    colorClass: "danger",
    body: <TbLambda />,
  },
  {
    type: node.NodeType.Beta,
    colorClass: "secondary",
    body: <TbBeta />,
  },
];

const NodeEditorHeader = (props: NodeEditorHeaderProps) => {
  const dropDownMenus = [
    <a className="dropdown-item" onClick={props.callbacks.discard}>
      <TbTrash />
      &nbsp;
      {i18n.t("nodeEditor.menu.discard")}
    </a>,
  ];
  const typeIndex = typeButtonList.findIndex(
    tb => tb.type === props.editingType,
  );
  const updateSelected = (idx: number) => {
    props.onEditingTypeChange(typeButtonList[idx].type);
  };
  return (
    <div className="node-editor-header">
      <div className="input-group shadow">
        <button id="" className="btn btn-primary" data-bs-toggle="dropdown">
          <TbEdit />
        </button>
        <ul className="dropdown-menu">
          {dropDownMenus.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
        <RadioButtons
          selected={typeIndex}
          onClick={updateSelected}
          color={typeButtonList.map(tb => tb.colorClass)}
          className="flex-grow-1 px-0">
          {typeButtonList.map((tb, idx) => (
            <span key={idx}>{tb.body}</span>
          ))}
        </RadioButtons>
        <button className="btn btn-success" onClick={props.callbacks.close}>
          <TbCheck />
        </button>
      </div>
    </div>
  );
};

export default memo(NodeEditorHeader);
