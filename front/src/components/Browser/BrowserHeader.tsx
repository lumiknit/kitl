import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faFolderTree } from "@fortawesome/free-solid-svg-icons";
import DropdownSelect from "../Helpers/DropdownSelect";
import storageManager from "../Storage/StorageManager";

export type BrowserHeaderProps = {
  storage: string;
  path: string;
  pathType: string;

  onClose: () => void;
  changeStorage: (value: string) => void;
  changePath: (value: string) => void;

  newFile: () => void;
  newFolder: () => void;
  cut: () => void;
  copy: () => void;
  paste: () => void;
  delete: () => void;
  rename: () => void;
};

const BrowserHeader = (props: BrowserHeaderProps) => {
  return (
    <div className="m-Browser-header shadow">
      <div className="input-group">
        <button
          className="btn btn-primary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false">
          <FontAwesomeIcon icon={faFolderTree} />
        </button>
        <ul className="dropdown-menu">
          <li>
            <a href="#" className="dropdown-item" onClick={props.newFile}>
              New File
            </a>
          </li>
          <li>
            <a href="#" className="dropdown-item" onClick={props.newFolder}>
              New Folder
            </a>
          </li>
          <li>
            <hr />
          </li>
          <li>
            <a href="#" className="dropdown-item" onClick={props.cut}>
              Cut
            </a>
          </li>
          <li>
            <a href="#" className="dropdown-item" onClick={props.copy}>
              Copy
            </a>
          </li>
          <li>
            <a href="#" className="dropdown-item" onClick={props.paste}>
              Paste
            </a>
          </li>
          <li>
            <a href="#" className="dropdown-item" onClick={props.delete}>
              Delete
            </a>
          </li>
          <li>
            <hr />
          </li>
          <li>
            <a href="#" className="dropdown-item" onClick={props.rename}>
              Rename
            </a>
          </li>
        </ul>

        <DropdownSelect
          options={Object.keys(storageManager.storages)}
          value={props.storage}
          btnClassName="btn-primary"
          onChange={props.changeStorage}
        />
        <input
          type="text"
          className={
            "form-control" + (props.pathType === "unknown" ? " is-invalid" : "")
          }
          placeholder="Path"
          value={props.path}
          readOnly={true}
          onChange={e => props.changePath(e.target.value)}
        />
        <button
          className="btn btn-danger"
          type="button"
          onClick={props.onClose}>
          <FontAwesomeIcon icon={faClose} />
        </button>
      </div>
    </div>
  );
};

export default BrowserHeader;
