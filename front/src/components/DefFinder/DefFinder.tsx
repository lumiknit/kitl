import { memo, useCallback, useRef, useState } from "react";
import * as name from "../../common/name";
import * as d from "../../common/def";

export type DefFinderProps = {
  defaultValue: d.Def;
  onChange?: (value: d.Def) => void;
  className?: string;
};

const DefFinder = (props: DefFinderProps) => {
  const [n] = useState(() => {
    return name.whitenName(name.cloneName(props.defaultValue));
  });
  const nameRef = useRef<HTMLInputElement>(null);
  const moduleRef = useRef<HTMLInputElement>(null);

  const onChange = useCallback(() => {
    if (props.onChange === undefined) {
      return;
    }
    const name = nameRef.current?.value;
    const module = moduleRef.current?.value;

    if (name === undefined || module === undefined) {
      return;
    }

    props.onChange(d.newDef(d.DefType.Value, name, module));
  }, [props.onChange]);

  return (
    <div className={`def-finder ${props.className}`}>
      <div className="def-finder-inputs">
        <div className="form-floating mb-1">
          <input
            ref={nameRef}
            type="text"
            className="form-control"
            placeholder="Name"
            defaultValue={n.name}
            onChange={onChange}
          />
          <label>Name</label>
        </div>
        <div className="form-floating">
          <input
            ref={moduleRef}
            type="text"
            className="form-control"
            placeholder="Module"
            defaultValue={n.module}
            onChange={onChange}
          />
          <label>Module</label>
        </div>
      </div>
      <div className="def-finder-list">{/*TODO*/}</div>
    </div>
  );
};

export default memo(DefFinder);
