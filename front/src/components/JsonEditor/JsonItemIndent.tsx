import "bootstrap/dist/css/bootstrap.css";

import "./JsonEditor.css";
import "./JsonIndent.css";

type JsonItemIndentProps = {
  level: number;
};

const JsonItemIndent = (props: JsonItemIndentProps) => {
  const levelWidth = 2;

  const entierStyle = {
    flex: `0 0 ${levelWidth * props.level}px`,
  };

  return <div className="json-item-indent" style={entierStyle} />;
};

export default JsonItemIndent;
