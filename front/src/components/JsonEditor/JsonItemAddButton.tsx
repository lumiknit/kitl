import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as jh from "./helper";

export type JsonItemAddButtonProps = {
  path: jh.JsonPath;
};

const JsonItemAddButton = (props: JsonItemAddButtonProps) => {
  const indent = props.path.length;
  const indentColor = (indent + 1) % 6;

  const btnAdd = `btn btn-sm json-btn-depth-${indentColor}`;

  return (
    <div className="d-flex">
      <div className="flex-grow-1">
        <hr />
      </div>
      <button type="button" className={btnAdd}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
      <div className="flex-grow-1">
        <hr />
      </div>
    </div>
  );
};

export default JsonItemAddButton;