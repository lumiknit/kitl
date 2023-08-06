import { faCheck, faCommentDots, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as node from "../../common/node";

export type NodeEditorHeaderProps = {
  closeBtnRef: React.RefObject<HTMLButtonElement>;
  path: string;
  value: node.NodeData;
  discard: () => void;
  save: () => void;
};

const TypeButtons = (props: NodeEditorHeaderProps) => {
  const btns = [
    <button
      key="comment"
      className="btn btn-outline-success flex-grow-1 px-0"
      onClick={() => props.updateType("comment")}>
      <FontAwesomeIcon icon={faCommentDots} />
    </button>,
    <button
      key="lambda"
      className="btn btn-outline-primary flex-grow-1 px-0"
      onClick={() => props.updateType("lambda")}>
      <b>λ</b>
    </button>,
    <button
      key="beta"
      className="btn btn-outline-secondary flex-grow-1 px-0"
      onClick={() => props.updateType("beta")}>
      <b>β</b>
    </button>
  ]
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
        <TypeButtons {...props} />
        <button
          ref={props.closeBtnRef}
          className="btn btn-danger"
          onClick={props.discard}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
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