import 'bootstrap/dist/css/bootstrap.css';

import './JsonEditor.css';
import * as jh from './helper';

type JsonTypeSelectProps = {
  value: any,
  onTypeSelect: (newType: number) => void,
};

const JsonTypeSelect = (props: JsonTypeSelectProps) => {
  const valueType = jh.jsonTypeOf(props.value);

  const btnGroup = () => {
    const arr = Array(jh.jsonTypeSymbols.length);
    for(let i = 0; i < jh.jsonTypeSymbols.length; i++) {
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
            {jh.jsonTypeSymbols[i]}
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
