import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as jh from "./helper";
import * as je from "./edit";

export type JsonItemValueBoolProps = {
  type: jh.JsonType;
  path: jh.JsonPath;
  updateEditing: (f: je.UpdateEdit) => void;
};

const JsonItemValueBool = (props: JsonItemValueBoolProps) => {
  const btns = new Array(3);
  for (let i = 0; i < 3; i++) {
    const icon = jh.jsonTypeIcons[i];
    const label = jh.jsonTypes[i];
    const cls =
      props.type === i
        ? `btn ${jh.jsonBtnDepthClass(props.path.length)} py-1 flex-grow-1 px-0`
        : `btn ${jh.jsonBtnOutlineDepthClass(
            props.path.length,
          )} py-1 flex-grow-1 px-0`;
    btns.push(
      <button
        key={i}
        className={cls}
        type="button"
        onClick={() => {
          props.updateEditing(
            je.applyJsonEdit([
              new je.UpdateAction(props.path, jh.emptyJsonValueOfType(i)),
            ]),
          );
        }}>
        <FontAwesomeIcon icon={icon} />
        &nbsp;
        {label}
      </button>,
    );
  }
  return btns;
};

export default JsonItemValueBool;
