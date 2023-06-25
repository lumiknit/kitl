import 'bootstrap/dist/css/bootstrap.css';

import './JsonEditor.css';
import * as jh from './helper';
import BI from '../Util/BI';
import JsonItemIndent from './JsonItemIndent';

type JsonTypeSelectProps = {
  depth: number,
  value: any,
  onTypeSelect: (newType: number) => void,
};

const JsonTypeSelect = (props: JsonTypeSelectProps) => {
  const valueType = jh.jsonTypeOf(props.value);

  const btnGroup = () => {
    const arr = Array(jh.jsonTypeIcons.length);
    for(let i = 0; i < jh.jsonTypeIcons.length; i++) {
      let btnClass = `btn btn-outline-primary`;
      if(i === valueType) {
        btnClass = `btn btn-primary`;
      }
      arr.push(
        <button
          type="button"
          className={btnClass}
          onClick={() => props.onTypeSelect(i)}
          key={i}>
            <BI iconName={jh.jsonTypeIcons[i]} />
        </button>
      );
    }
    return arr;
  }

  return (
    <div className="json-item-line">
      <JsonItemIndent level={props.depth} />
      <div className="input-group m-1" role="group">
        {btnGroup()}
      </div>
    </div>
  );
};

export default JsonTypeSelect;
