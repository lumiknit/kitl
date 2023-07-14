import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import * as jh from "./helper";

export type JsonItemValueCollectionProps = {
  path: jh.JsonPath;
  type: string;
  size: number;
  opened: boolean;
};

const JsonItemValueCollection = (props: JsonItemValueCollectionProps) => {
  const indent = props.path.length + 1;
  const indentColor = indent % 6;
  const btnClass = `btn json-btn-depth-${indentColor} py-1 px-2`;
  const icon = props.opened ? faCaretDown : faCaretRight;
  return (
    <>
      <input
        className="form-control py-1"
        type="text"
        defaultValue={`${props.type}[${props.size}]`}
        disabled
        readOnly
      />
      <button
        className={btnClass}
      >
        <FontAwesomeIcon icon={icon} />
      </button>
    </>
  )
};

export default JsonItemValueCollection;