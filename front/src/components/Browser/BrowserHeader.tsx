import {
  TbClipboard,
  TbCopy,
  TbFilePlus,
  TbFolderPlus,
  TbFolderSearch,
  TbScissors,
  TbTag,
  TbTrash,
  TbX,
} from "react-icons/tb";
import DropdownSelect from "../Helpers/DropdownSelect";

export type BrowserHeaderProps = {
  storages: string[];
  storage: string;
  path: string;

  onClose: () => void;
};

const PopupBtn = (props: {
  icon: JSX.Element;
  text: string;
  onClick?: () => void;
}) => {
  return (
    <a href="#" className="dropdown-item" onClick={props.onClick}>
      {props.icon} {props.text}
    </a>
  );
};

const BrowserHeader = (props: BrowserHeaderProps) => {
  const buttons = [
    <PopupBtn icon={<TbFilePlus />} text="New File" />,
    <PopupBtn
      icon={<TbFolderPlus />}
      text="New Folder"
    />,
    <hr />,
    <PopupBtn icon={<TbScissors />} text="Cut" />,
    <PopupBtn icon={<TbCopy />} text="Copy" />,
    <PopupBtn icon={<TbClipboard />} text="Paste" />,
    <PopupBtn icon={<TbTrash />} text="Delete" />,
    <hr />,
    <PopupBtn icon={<TbTag />} text="Rename" />,
  ];
  return (
    <div className="m-browser-header shadow">
      <div className="input-group">
        <button
          className="btn btn-primary"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false">
          <TbFolderSearch />
        </button>
        <ul className="dropdown-menu">
          {buttons.map((button, index) => {
            return <li key={index}>{button}</li>;
          })}
        </ul>
        <DropdownSelect
          btnClassName="btn-primary"
          options={props.storages}
          value={props.storage}
          onChange={() => {}}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Path"
          value={props.path}
          readOnly={true}
          onChange={e => {e}}
        />
        <button
          className="btn btn-danger"
          type="button"
          onClick={props.onClose}>
          <TbX />
        </button>
      </div>
    </div>
  );
};

export default BrowserHeader;
