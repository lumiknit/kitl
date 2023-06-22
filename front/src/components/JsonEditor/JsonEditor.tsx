import { useState } from 'react';

import JsonItemType from './JsonItemType';
import JsonItem from './JsonItem';

import 'bootstrap/dist/css/bootstrap.css';
import './JsonEditor.css';

const JsonEditor = () => {
  return (
    <>
      <div>
        Test
        <JsonItem value={42} />
      </div>
    </>
  );
};

export default JsonEditor;
