import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as jh from './helper';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';

export type JsonItemValueTypeProps = {
  path: jh.JsonPath;
  value: jh.Json;
  changeType: (type: jh.JsonType) => void;
};

const JsonItemValueShow = (props: JsonItemValueTypeProps) => {
  const indent = props.path.length;
  const indentColor = indent % 6;

  const btnHandle = `btn json-btn-depth-${indentColor} p-1`;
  const btnType = `btn json-btn-outline-depth-${indentColor} p-1 flex-grow-1`;
  const typeBtns = [];
  // Insert null/false/true
  let firstIcon = jh.jsonTypeIcons[0];
  let firstType = jh.JsonType.NULL;
  if(props.value === false) {
    firstIcon = jh.jsonTypeIcons[1];
    firstType = jh.JsonType.FALSE;
  } else if(props.value === true) {
    firstIcon = jh.jsonTypeIcons[2];
    firstType = jh.JsonType.TRUE;
  }
  typeBtns.push(
    <button
      key={0}
      className={btnType}
      type="button"
      onClick={() => props.changeType(firstType)}
    >
      <FontAwesomeIcon icon={firstIcon} />
    </button>
  );
  for(let i = 3; i < jh.jsonTypeIcons.length; i++) {
    const icon = jh.jsonTypeIcons[i];
    typeBtns.push(
      <button
        key={i}
        className={btnType}
        type="button"
        onClick={() => props.changeType(i)}
      >
        <FontAwesomeIcon icon={icon} />
      </button>
    );
  }
  return (
    <div className="json-item-value-type input-group">
      <button className={btnHandle} type="button">
        <FontAwesomeIcon icon={faGripVertical} />
      </button>
      {typeBtns}
    </div>
  );
};

export default JsonItemValueShow;