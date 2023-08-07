import { faCheck, faCommentDots, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as node from "../../common/node";

export type NodeEditorHeaderProps = {
  closeBtnRef: React.RefObject<HTMLButtonElement>;
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
    body: (<FontAwesomeIcon icon={faCommentDots} />)
  },
  {
    type: node.NodeType.Lambda,
    colorClass: "primary",
    body: (<b>λ</b>)
  },
  {
    type: node.NodeType.Beta,
    colorClass: "secondary",
    body: (<b>β</b>)
  }
];

const TypeButtons = (props: NodeEditorHeaderProps) => {
  const btns = typeButtonList.map((tb) => {
    const btnCls = props.editingType === tb.type ? `btn-${tb.colorClass}` : `btn-outline-${tb.colorClass}`;
    return (
      <button
        key={tb.type}
        className={`btn ${btnCls} flex-grow-1 px-0`}
        onClick={() => props.updateEditingType(tb.type)}>
        {tb.body}
      </button>
    );
  });
  return btns;
};

const NodeEditorHeader = (props: NodeEditorHeaderProps) => {
  return (
    <div className="node-editor-header">
      <div className="input-group shadow">
        <button
          className="btn btn-primary"
        >
          <FontAwesomeIcon icon={faEdit} />
        </button>
        {/* TODO: Add dropdown and add discard menu */}
        <TypeButtons {...props} />
        <button
          ref={props.closeBtnRef}
          className="btn btn-success"
          onClick={props.save}
        >
          <FontAwesomeIcon icon={faCheck} />
        </button>
      </div>
    </div>
  )
};

export default NodeEditorHeader;