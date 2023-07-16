import React, { ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import * as jh from "./helper";

export type JsonItemValueContainerProps = {
  path: jh.JsonPath;
  value: jh.Json;
  toggleType: () => void;
  toggleIndex: () => void;
  children: ReactElement | ReactElement[];
};

const Buttons = React.memo((props: JsonItemValueContainerProps) => {
  const indent = props.path.length;
  const indentColor = indent % 6;

  const btnHandle = `btn json-btn-depth-${indentColor} py-1 px-2`;

  const ty = jh.jsonTypeOf(props.value);
  const icon = jh.jsonTypeIcons[ty];

  return (
    <>
      <button className={btnHandle} type="button" onClick={props.toggleIndex}>
        <div
          style={{
            display: "inline-block",
            width: indent * 2,
            height: 1,
          }}
        />
        <FontAwesomeIcon icon={faGripVertical} />
      </button>
      <button className={btnHandle} type="button" onClick={props.toggleType}>
        <FontAwesomeIcon icon={icon} className="fa-fw" />
      </button>
    </>
  );
});

const JsonItemValueContainer = (props: JsonItemValueContainerProps) => {
  return (
    <>
      <div className="json-item-value input-group">
        <Buttons {...props} />
        {props.children}
      </div>
    </>
  );
};

export default JsonItemValueContainer;
