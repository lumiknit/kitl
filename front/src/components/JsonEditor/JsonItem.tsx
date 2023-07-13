import * as jh from "./helper";
import JsonItemIndex from "./JsonItemIndex";
import JsonItemValue from "./JsonItemValue";

export type JsonItemProps = {
  path: jh.JsonPath;
  value: jh.Json;
};

const JsonItem = (props: JsonItemProps) => {
  return (
    <div className="json-item">
      <JsonItemIndex path={props.path} />
      <JsonItemValue path={props.path} value={props.value} />
    </div>
  );
};

export default JsonItem;
