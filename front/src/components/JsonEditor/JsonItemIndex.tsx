import { useMemo } from 'react';
import * as jh from './helper';

export type JsonItemIndexProps = {
  path: jh.JsonPath;
};

const JsonItemIndex = (props: JsonItemIndexProps) => {
  return useMemo(() => {
    return (
      <div className="json-item-index">
        {jh.pathToString(props.path)}
      </div>
    );
  }, [props.path]);
};

export default JsonItemIndex;