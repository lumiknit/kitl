export type NameDisplayProps = {
  name: string;
  module: string;
};

const NameDisplay = (props: NameDisplayProps) => {
  return (
    <div className="flow-name-display">
      <div className="flow-name-display-name">{props.name}</div>
      {props.module === "" ? null : (
        <div className="flow-name-display-module">@ {props.module}</div>
      )}
    </div>
  );
};

export default NameDisplay;
