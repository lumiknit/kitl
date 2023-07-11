import * as jh from "./helper";
import JsonItemValueContainer from "./JsonItemValueContainer";

export type JsonItemValueShowProps = {
  path: jh.JsonPath;
  value: jh.Json;
  changeType: (type?: jh.JsonType) => void;
};

const JsonItemValueShow = (props: JsonItemValueShowProps) => {
  return (
    <JsonItemValueContainer
      path={props.path}
      value={props.value}
      changeType={props.changeType}>
      <input
        className="form-control"
        type="text"
        defaultValue={String(props.value)}
        readOnly
      />
    </JsonItemValueContainer>
  );
};

export default JsonItemValueShow;
