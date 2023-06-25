import { useState } from 'react';

import * as jh from './helper';


import 'bootstrap/dist/css/bootstrap.css';

import './JsonEditor.css';

type JsonItemIndentProps = {
  level: number,
};

const JsonItemIndent = (props: JsonItemIndentProps) => {
  // Indent guid size is 4px * 5 = 20px
  const levelCount = 5;
  const levelWidth = 4;
  const levelStyles = 4;

  const x = levelWidth * (props.level % levelCount);
  const l = Math.floor(props.level / levelCount);
  const lLeft = 1 + l % levelStyles;
  const lRight = l === 0 ? 0 : 1 + (l - 1) % levelStyles;

  const leftClass = `json-item-indent-left json-item-indent-${lLeft}`;
  const rightClass = `json-item-indent-right json-item-indent-${lRight}`;

  const entierStyle = {
    flex: `0 0 ${levelWidth * levelCount}px`,
  };
  const leftStyle = {
    width: `${x}px`,
  };
  const rightStyle = {
    width: `${levelCount * levelWidth - x - 1}px`,
  };

  return (
    <div className="json-item-indent" style={entierStyle}>
      <div className={leftClass} style={leftStyle} />
      <div className={rightClass} style={rightStyle} />
    </div>
  );
};

export default JsonItemIndent;
