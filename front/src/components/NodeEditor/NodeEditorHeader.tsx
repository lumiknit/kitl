import {
  faCheck,
  faCommentDots,
  faEdit,
  faQuoteLeft,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as node from "../../common/node";
import RadioButtons from "../Helpers/RadioButtons";

export type NodeEditorHeaderProps = {
  path: string;
  value: node.NodeData;
  editingType: node.NodeType;
  discard: () => void;
  save: () => void;
  updateEditingType: (ty: node.NodeType) => void;
};

const typeButtonList = [
  {
    type: node.NodeType.Comment,
    colorClass: "success",
    body: <FontAwesomeIcon icon={faCommentDots} />,
  },
  {
    type: node.NodeType.Literal,
    colorClass: "primary",
    body: <FontAwesomeIcon icon={faQuoteLeft} />,
  },
  {
    type: node.NodeType.Lambda,
    colorClass: "danger",
    body: <b>λ</b>,
  },
  {
    type: node.NodeType.Beta,
    colorClass: "secondary",
    body: <b>β</b>,
  },
];

const NodeEditorHeader = (props: NodeEditorHeaderProps) => {
  const dropDownMenus = [
    <a className="dropdown-item" onClick={props.discard}>
      <FontAwesomeIcon className="fa-fw" icon={faTrash} />
      &nbsp; Discard
    </a>,
  ];
  const typeIndex = typeButtonList.findIndex(
    tb => tb.type === props.editingType,
  );
  const updateSelected = (idx: number) => {
    props.updateEditingType(typeButtonList[idx].type);
  };
  return (
    <div className="node-editor-header">
      <div className="input-group shadow">
        <button id="" className="btn btn-primary" data-bs-toggle="dropdown">
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <ul className="dropdown-menu">
          {dropDownMenus.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
        <RadioButtons
          selected={typeIndex}
          updateSelected={updateSelected}
          color={typeButtonList.map(tb => tb.colorClass)}
          className="flex-grow-1 px-0">
          {typeButtonList.map((tb, idx) => (
            <span key={idx}>{tb.body}</span>
          ))}
        </RadioButtons>
        <button className="btn btn-success" onClick={props.save}>
          <FontAwesomeIcon icon={faCheck} />
        </button>
      </div>
    </div>
  );
};

export default NodeEditorHeader;
