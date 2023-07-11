import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as jh from "./helper";
import JsonItemValueContainer from "./JsonItemValueContainer";

export type JsonItemValueTypeProps = {
  path: jh.JsonPath;
  value: jh.Json;
  changeType: (type?: jh.JsonType) => void;
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
        onClick={() => props.changeType(i)}>
        <FontAwesomeIcon icon={icon} />
      </button>
    );
  }
  return (
    <JsonItemValueContainer
      path={props.path}
      value={props.value}
      changeType={props.changeType}>
      {typeBtns}
    </JsonItemValueContainer>
  );
};

export default JsonItemValueShow;
