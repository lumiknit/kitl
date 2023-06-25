import 'bootstrap/dist/css/bootstrap.css';

import './JsonEditor.css';
import * as jh from './helper';
import BI from '../Util/BI';

type JsonTypeSelectProps = {
  value: any,
  onTypeSelect: (newType: number) => void,
};

const JsonTypeSelect = (props: JsonTypeSelectProps) => {
  const valueType = jh.jsonTypeOf(props.value);

  const btnGroup = () => {
    const arr = Array(jh.jsonTypeIcons.length);
    for(let i = 0; i < jh.jsonTypeIcons.length; i++) {
      let btnClass = `btn btn-outline-primary p-2`;
      if(i === valueType) {
        btnClass = `btn btn-primary p-2`;
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
    <div className="input-group" role="group">
      {btnGroup()}
    </div>
  );
};

export default JsonTypeSelect;
