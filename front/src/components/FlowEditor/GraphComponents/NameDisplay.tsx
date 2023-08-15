import { memo } from "react";
import * as name from "../../../common/name";
import opNameSymbol from "./opsym";

export type NameDisplayProps = {
  name: name.Name;
};

const NameDisplay = (props: NameDisplayProps) => {
  const wn = name.whitenName(props.name);
  const replaced = opNameSymbol[wn.name];
  const wnn = replaced !== undefined ? replaced : wn.name;
  return (
    <div className="flow-name-display">
      <div className="flow-name-display-name">{wnn}</div>
      {wn.module === "" ? null : (
        <div className="flow-name-display-module">@ {wn.module}</div>
      )}
    </div>
  );
};

export default memo(NameDisplay);
