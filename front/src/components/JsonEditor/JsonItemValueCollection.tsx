import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import * as jh from "./helper";

export type JsonItemValueCollectionProps = {
  path: jh.JsonPath;
  type: string;
  size: number;
  folded: boolean;
  toggleFolded: () => void;
};

const JsonItemValueCollection = (props: JsonItemValueCollectionProps) => {
  return useMemo(() => {
    const indent = props.path.length + 1;
    const indentColor = indent % 6;
    const btnClass = `btn json-btn-depth-${indentColor} py-1 px-2`;
    const icon = props.folded ? faCaretRight : faCaretDown;
    return (
      <>
        <div className="input-group-text flex-grow-1 py-1">
          {`${props.type}[${props.size}]`}
        </div>
        <button type="button" className={btnClass} onClick={props.toggleFolded}>
          <FontAwesomeIcon icon={icon} className="fa-fw" />
        </button>
      </>
    );
  }, [props.path, props.type, props.size, props.folded]);
};

export default JsonItemValueCollection;
