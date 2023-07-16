import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as jh from "./helper";
import * as je from "./edit";

export type JsonItemValueBoolProps = {
  indent: number;
  type: jh.JsonType;
  path: jh.JsonPath;
  updateEditing: (f: je.UpdateEdit) => void;
};

const JsonItemValueBool = (props: JsonItemValueBoolProps) => {
  const indentColor = props.indent % 6;
  const btns = new Array(3);
  for (let i = 0; i < 3; i++) {
    const icon = jh.jsonTypeIcons[i];
    const label = jh.jsonTypes[i];
    const cls =
      props.type === i
        ? `btn json-btn-depth-${indentColor} py-1 flex-grow-1 px-0`
        : `btn json-btn-outline-depth-${indentColor} py-1 flex-grow-1 px-0`;
    btns.push(
      <button
        key={i}
        className={cls}
        type="button"
        onClick={() => {
          props.updateEditing(
            je.applyJsonEdit([
              new je.UpdateAction(props.path, jh.emptyJsonValueOfType(i)),
            ])
          );
        }}>
        <FontAwesomeIcon icon={icon} />
        &nbsp;
        {label}
      </button>
    );
  }
  return btns;
};

export default JsonItemValueBool;
