import 'bootstrap/dist/css/bootstrap.css';

import './JsonEditor.css';
import * as helper from './helper';

type JsonTypeSelectProps = {
  value: any,
  onTypeSelect: (newType: number) => void,
};

const JsonTypeSelect = (props: JsonTypeSelectProps) => {
  const valueType = helper.jsonTypeOf(props.value);

  const btnGroup = () => {
    const arr = Array(helper.jsonTypeSymbols.length);
    for(let i = 0; i < helper.jsonTypeSymbols.length; i++) {
      let className = `btn btn-outline-primary p-2`;
      if(i === valueType) {
        className = `btn btn-primary p-2`;
      }
      arr.push(
        <button
          type="button"
          className={className}
          onClick={() => props.onTypeSelect(i)}
          key={i}>
            {helper.jsonTypeSymbols[i]}
        </button>
      );
    }
    return arr;
  }

  return (
    <div className="btn-group" role="group">
      <button
        type="button"
        className="btn btn-danger">
          X
      </button>
      {btnGroup()}
    </div>
  );
};

export default JsonTypeSelect;
