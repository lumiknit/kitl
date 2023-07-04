import BI from "../Util/BI";
import BICheckBox from "../Util/BICheckBox";

import * as jc from "./JsonEditorContext";

type JsonEditorHeaderProps = {
  // Path
  path: string;
  // Mode
  mode: jc.EditMode;
  updateMode: (mode: jc.EditMode) => void;
  // Configs
  showStringEscape: boolean;
  toggleStringEscape: () => void;
  // Actions
  downloadJson: () => void;
};

const JsonEditorHeader = (props: JsonEditorHeaderProps) => {
  const menuButton = (
    <button className="btn btn-warning" data-bs-toggle="dropdown">
      <BI iconName={jc.editModeIcons[props.mode]} />
    </button>
  );
  const dropDownMenu = (
    <ul className="dropdown-menu">
      {jc.editModeLabels.map((label, idx) => {
        return (
          <li key={idx}>
            <a
              className="dropdown-item"
              href="#"
              onClick={() => props.updateMode(idx)}>
              <BI iconName={jc.editModeIcons[idx]} />
              &nbsp;
              {label}
            </a>
          </li>
        );
      })}
      <li>
        <hr />
      </li>
      <li>
        <a
          className="dropdown-item"
          href="#"
          onClick={props.toggleStringEscape}>
          <BICheckBox checked={props.showStringEscape} />
          &nbsp; Show string escapes
        </a>
      </li>
      <li>
        <hr />
      </li>
      <li>
        <a className="dropdown-item" href="#" onClick={props.downloadJson}>
          <BI iconName="download" />
          &nbsp; Download
        </a>
      </li>
    </ul>
  );
  let controls = [];
  switch (props.mode) {
    case jc.EditMode.Text:
    case jc.EditMode.Tree:
      controls = [
        <input
          key="0"
          type="text"
          className="form-control"
          placeholder="Path"
          value={props.path}
          disabled
        />,
        <button key="1" className="btn btn-secondary">
          <BI iconName="arrow-clockwise" />
        </button>,
        <button key="2" className="btn btn-secondary">
          <BI iconName="save" />
        </button>,
      ];
      break;
    case jc.EditMode.Select:
      controls = [
        <button key="0" className="btn btn-secondary flex-grow-1">
          <BI iconName="scissors" />
        </button>,
        <button key="1" className="btn btn-secondary flex-grow-1">
          <BI iconName="files" />
        </button>,
        <button key="2" className="btn btn-secondary flex-grow-1">
          <BI iconName="eraser" />
        </button>,
      ];
      break;
  }
  return (
    <div className="json-editor-header">
      <div className="input-group shadow-sm">
        {menuButton}
        {dropDownMenu}
        {controls}
      </div>
    </div>
  );
};

export default JsonEditorHeader;
