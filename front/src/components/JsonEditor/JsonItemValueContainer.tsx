import { ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import * as jh from "./helper";

export type JsonItemValueContainerProps = {
  path: jh.JsonPath;
  value: jh.Json;
  changeType: (toggle: boolean, type?: jh.JsonType) => void;
  children: ReactElement | ReactElement[];
};

const JsonItemValueContainer = (props: JsonItemValueContainerProps) => {
  const indent = props.path.length;
  const indentColor = indent % 6;

  const btnHandle = `btn json-btn-depth-${indentColor} py-1 px-2`;

  const ty = jh.jsonTypeOf(props.value);
  const icon = jh.jsonTypeIcons[ty];

  return (
    <div className="json-item-value-type input-group">
      <button className={btnHandle} type="button">
        <FontAwesomeIcon icon={faGripVertical} />
      </button>
      <button
        className={btnHandle}
        type="button"
        onClick={() => props.changeType(true)}>
        <FontAwesomeIcon icon={icon}
          className="fa-fw"
        />
      </button>
      {props.children}
    </div>
  );
};

export default JsonItemValueContainer;
