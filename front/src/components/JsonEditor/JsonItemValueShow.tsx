import * as jh from './helper';

export type JsonItemValueShowProps = {
  path: jh.JsonPath;
  value: jh.Json;
};

const JsonItemValueShow = (props: JsonItemValueShowProps) => {
  return (
    <div className="json-item-value-show">
    </div>
  );
};

export default JsonItemValueShow;