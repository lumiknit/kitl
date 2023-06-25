import { useState } from 'react';

import * as jh from './helper';
import BI from '../Util/BI';

import '@popperjs/core';
import 'bootstrap/dist/js/bootstrap.bundle';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './JsonEditor.css';

type JsonEditorHeaderProps = {
  mode: jh.EditMode,
  updateMode: (mode: jh.EditMode) => void,
}

const JsonEditorHeader = (props: JsonEditorHeaderProps) => {
  const menuButton = (
    <button className="btn btn-warning" data-bs-toggle="dropdown">
      <BI iconName={jh.editModeIcons[props.mode]} />
    </button>
  );
  const dropDownMenu = (
    <ul className="dropdown-menu">
      {
        jh.editModeLabels.map((label, idx) => {
          return <li key={idx}>
            <a
              className="dropdown-item"
              href="#"
              onClick={() => props.updateMode(idx)}>
              <BI iconName={jh.editModeIcons[idx]} />&nbsp;
              {label}
            </a>
          </li>;
        })
      }
    </ul>
  );
  let controls = [];
  switch(props.mode) {
  case jh.EditMode.Text:
  case jh.EditMode.Tree:
    controls = [
      <input key="0" type="text"
        className="form-control"
        placeholder="Path" />,
      <button key="1" className="btn btn-secondary">
        <BI iconName="arrow-clockwise" />
      </button>,
      <button key="2" className="btn btn-secondary">
        <BI iconName="save" />
      </button>,
    ];
    break;
  case jh.EditMode.Select:
    controls = [
      <button key="0" className="btn btn-secondary w-auto">
        <BI iconName="scissors" />
      </button>,
      <button key="1" className="btn btn-secondary w-auto">
        <BI iconName="files" />
      </button>,
      <button key="2" className="btn btn-secondary w-auto">
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
