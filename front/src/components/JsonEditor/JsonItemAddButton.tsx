import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as jh from "./helper";

export type JsonItemAddButtonProps = {
  path: jh.JsonPath;
  onClick: () => void;
};

const JsonItemAddButton = (props: JsonItemAddButtonProps) => {
  const cls = jh.jsonCollectionBorderClass(props.path.length);
  const btnAdd = `btn ${jh.jsonBtnDepthClass(
    props.path.length,
  )} json-value-collection-add-btn`;
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
