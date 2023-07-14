import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as jh from "./helper";

export type JsonItemAddButtonProps = {
  path: jh.JsonPath;
  onClick: () => void;
};

const JsonItemAddButton = (props: JsonItemAddButtonProps) => {
  const indent = props.path.length;
  const indentColor = indent % 6;
  const indentColor1 = (indent + 1) % 6;

  const cls = `json-value-collection-border-${indentColor}`;
  const btnAdd = `btn btn-sm json-btn-depth-${indentColor1} json-value-collection-add-btn`;

  return (
    <div className="json-value-collection-border">
      <div className="flex-grow-1">
        <hr className={cls} />
      </div>
      <button type="button" className={btnAdd} onClick={props.onClick}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
      <div className="flex-grow-1">
        <hr className={cls} />
      </div>
    </div>
  );
};

export default JsonItemAddButton;
