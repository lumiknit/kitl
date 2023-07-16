import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as je from "./edit";
import * as jh from "./helper";
import JsonItemValueContainer from "./JsonItemValueContainer";

export type JsonItemValueTypeProps = {
  path: jh.JsonPath;
  value: jh.Json;
  updateEditing: (f: je.UpdateEdit) => void;
  toggleType: () => void;
  toggleIndex: () => void;
};

const changeType =
  (
    toggleType: () => void,
    updateEditing: (f: je.UpdateEdit) => void,
    ty: jh.JsonType,
    path: jh.JsonPath,
    newType?: jh.JsonType
  ) =>
  () => {
    toggleType();
    if (newType !== undefined && newType !== ty) {
      updateEditing(
        je.applyJsonEdit([
          new je.UpdateAction(path, jh.emptyJsonValueOfType(newType)),
        ])
      );
    }
  };

const JsonItemValueShow = (props: JsonItemValueTypeProps) => {
  const indent = props.path.length;
  const indentColor = indent % 6;

  const btnType = `btn json-btn-outline-depth-${indentColor} p-1 flex-grow-1`;
  const typeBtns = [];
  const ty = jh.jsonTypeOf(props.value);
  const list = [0, 3, 4, 5, 6];
  // Insert null/false/true
  if (props.value === false) {
    list[0] = 1;
  } else if (props.value === true) {
    list[0] = 2;
  }
  for (const i of list) {
    if (i === ty) {
      continue;
    }
    const icon = jh.jsonTypeIcons[i];
    typeBtns.push(
      <button
        key={i}
        className={btnType}
        type="button"
        onClick={changeType(
          props.toggleType,
          props.updateEditing,
          ty,
          props.path,
          i
        )}>
        <FontAwesomeIcon icon={icon} />
      </button>
    );
  }
  return (
    <JsonItemValueContainer
      path={props.path}
      value={props.value}
      toggleType={props.toggleType}
      toggleIndex={props.toggleIndex}>
      {typeBtns}
    </JsonItemValueContainer>
  );
};

export default JsonItemValueShow;
