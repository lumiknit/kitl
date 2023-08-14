import { memo, useCallback } from "react";
import * as d from "../../common/def";
import i18n from "../../locales/i18n";

export type DefFinderProps = {
  value: d.Def;
  onChange?: (value: d.Def) => void;
  className?: string;
};

const DefFinder = (props: DefFinderProps) => {
  const n = props.value;

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      props.onChange?.(d.newDef(d.DefType.Value, val, n.module));
    },
    [props.onChange],
  );

  const handleModuleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      props.onChange?.(d.newDef(d.DefType.Value, n.name, val));
    },
    [props.onChange],
  );

  return (
    <div className={`def-finder ${props.className}`}>
      <div className="def-finder-inputs">
        <div className="form-floating mb-1">
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            value={n.name}
            onChange={handleNameChange}
          />
          <label className="text-muted">{i18n.t('defFinder.name')}</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            placeholder="Module"
            value={n.module}
            onChange={handleModuleChange}
          />
          <label className="text-muted">{
          i18n.t('defFinder.module')}</label>
        </div>
      </div>
      <div className="def-finder-list">{/*TODO*/}</div>
    </div>
  );
};

export default memo(DefFinder);
