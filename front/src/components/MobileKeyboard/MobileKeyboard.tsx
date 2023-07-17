import "./MobileKeyboard.css";

const Key = (props: { value: string; insert: (value: string) => void }) => {
  return (
    <button
      type="button"
      className="btn btn-outline-secondary py-1 px-0 flex-grow-1"
      onMouseDown={event => {
        event.preventDefault();
        props.insert(props.value);
      }}>
      {props.value}
    </button>
  );
};

const KeyRow = (props: { keys: string[]; insert: (value: string) => void }) => {
  const keys = props.keys.map(key => {
    return <Key key={key} value={key} insert={props.insert} />;
  });
  return <div className="input-group">{keys}</div>;
};

export type MobileKeyboardProps = {
  insert: (value: string) => void;
};

const MobileKeyboard = (props: MobileKeyboardProps) => {
  const row0 = ["{", "~", "!", "@", "#", "$", "%", "|", "}"];
  const row1 = ["[", "`", "&", "*", "_", "+", "^", "\\", "]"];
  const row2 = ["(", '"', "'", "?", "-", "=", "<", ">", ")"];
  return (
    <div className="mobile-keyboard m-1">
      <KeyRow keys={row0} insert={props.insert} />
      <KeyRow keys={row1} insert={props.insert} />
      <KeyRow keys={row2} insert={props.insert} />
    </div>
  );
};

export default MobileKeyboard;
