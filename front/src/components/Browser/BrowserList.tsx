import { File } from "./Browser";

export type BrowserListProps = {
  type: string;
  path: string;
  list: File[];
  checkItem: (name: string) => void;
  checkAll: () => void;
  clickItem: (name: string) => void;
};

const Item = (props: {
  type: string;
  name: string;
  checked: boolean;
  check: () => void;
  click: () => void;
}) => {
  const typeCls = props.type === "directory" ? "btn-primary" : "btn-secondary";
  return (
    <div className="input-group mt-1">
      <button
        type="button"
        className={`btn ${typeCls}`}
        onClick={props.check}></button>
      <button
        type="button"
        className={`btn ${typeCls}`}
        onClick={props.check}></button>
      <div className="form-control" onClick={props.click}>
        {props.name}
      </div>
    </div>
  );
};

const BrowserList = (props: BrowserListProps) => {
  if (props.type === "directory") {
    return (
      <div>
        {props.path !== "/" ? (
          <Item
            name=".."
            type="directory"
            checked={false}
            check={() => {}}
            click={() => props.clickItem("..")}
          />
        ) : null}
        {props.list.map((item, index) => (
          <Item
            key={index}
            name={item.name}
            type={item.type}
            checked={item.checked}
            check={() => props.checkItem(item.name)}
            click={() => props.clickItem(item.name)}
          />
        ))}
      </div>
    );
  }
};

export default BrowserList;
