import React from "react";
import * as jh from "./helper";

export type JsonItemIndexProps = {
  path: jh.JsonPath;
  toggleIndex: () => void;
};

const JsonItemIndexShow = React.memo((props: JsonItemIndexProps) => {
  if (props.path.length === 0) return <></>;
  else {
    const arr = new Array(props.path.length);
    const l = props.path.length;
    for (let i = 0; i < l; i++) {
      const cls = i === 0 ? "badge bg-primary m-0" : "badge bg-secondary m-0";
      arr[i] = (
        <span key={i} className={cls}>
          {props.path[l - i - 1]}
        </span>
      );
    }
    return (
      <div
        className="json-item-index text-truncate"
        onClick={props.toggleIndex}>
        {arr}
      </div>
    );
  }
});

export default JsonItemIndexShow;
