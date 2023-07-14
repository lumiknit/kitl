import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as jh from "./helper";

const JsonItemEllipsis = (props: { path: jh.JsonPath }) => {
  const indent = props.path.length;
  const indentColor = indent % 6;
  const indentColor1 = (indent + 1) % 6;

  const cls = `json-value-collection-border-${indentColor}`;
  const eCls = `json-value-collection-ellipsis-${indentColor1}`;
  return (
    <div className="json-value-collection-border">
      <div className="flex-grow-1">
        <hr className={cls} />
      </div>
      <div className={eCls}>
        <FontAwesomeIcon icon={faEllipsis} className="fa-fw" />
      </div>
      <div className="flex-grow-1">
        <hr className={cls} />
      </div>
    </div>
  );
};

export default JsonItemEllipsis;
