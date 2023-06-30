import "bootstrap/dist/css/bootstrap.css";

import "./JsonEditor.css";
import "./JsonIndent.css";

import BI from "../Util/BI";

import * as jh from "./helper";

import JsonItemLine from "./JsonItemLine";

type JsonTypeSelectProps = {
  depth: number;
  index: number | string;
  path: string;
  value: jh.Json;
  onTypeSelect: (newType: number) => void;
};

const JsonTypeSelect = (props: JsonTypeSelectProps) => {
  const valueType = jh.jsonTypeOf(props.value);

  const btnGroup = () => {
    const arr = Array(jh.jsonTypeIcons.length);
    for (let i = 0; i < jh.jsonTypeIcons.length; i++) {
      const btnColorClass = jh.jsonBtnColorClass(props.depth, i !== valueType);
      const btnClass = `btn ${btnColorClass} py-1`;
      arr.push(
        <button
          type="button"
          className={btnClass}
          onClick={() => props.onTypeSelect(i)}
          key={i}
        >
          <BI iconName={jh.jsonTypeIcons[i]} />
        </button>
      );
    }
    return arr;
  };

  return (
    <JsonItemLine depth={props.depth} index={props.index} path={props.path}>
      <div className="btn-group btn-group-justified w-100" role="group">
        {btnGroup()}
      </div>
    </JsonItemLine>
  );
};

export default JsonTypeSelect;
