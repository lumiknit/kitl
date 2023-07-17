import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as jh from "./helper";
import React from "react";

const JsonItemEllipsis = React.memo(
  (props: { path: jh.JsonPath }) => {
    const cls = jh.jsonCollectionBorderClass(props.path.length);
    const eCls = jh.jsonCollectionEllipsisClass(props.path.length + 1);
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
  },
  (prev, next) => {
    return prev.path.length === next.path.length;
  },
);

export default JsonItemEllipsis;
